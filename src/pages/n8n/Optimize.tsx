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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2" />
                      Performance Analysis Fundamentals
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Performance analysis is the process of measuring and evaluating how efficiently your n8n workflows execute. 
                      By understanding where your workflows spend time and resources, you can identify optimization opportunities 
                      that dramatically improve execution speed and reduce resource consumption.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                      <h4 className="font-semibold mb-2">🎯 What You'll Learn:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>How to measure execution times for individual nodes and entire workflows</li>
                        <li>Understanding performance metrics and what they mean</li>
                        <li>Using n8n's built-in execution data to identify bottlenecks</li>
                        <li>Setting up performance baselines for comparison</li>
                        <li>Creating performance monitoring dashboards</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 1: Understanding Execution Data */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                      Step 1: Understanding n8n Execution Data
                    </h4>
                    <p className="mb-4">
                      Every time a workflow runs in n8n, detailed execution data is collected. This data contains timing information, 
                      memory usage, and other performance metrics that are crucial for analysis.
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">📊 Key Metrics to Monitor:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Execution Time:</strong> Total time from start to finish
                        </div>
                        <div>
                          <strong>Node Duration:</strong> Time spent in individual nodes
                        </div>
                        <div>
                          <strong>Queue Time:</strong> Time waiting in execution queue
                        </div>
                        <div>
                          <strong>Memory Usage:</strong> Peak memory consumption
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                      <h5 className="font-medium mb-2">🔍 Accessing Execution Data:</h5>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Navigate to your workflow in the n8n editor</li>
                        <li>Click on "Executions" tab in the left sidebar</li>
                        <li>Select a completed execution to view details</li>
                        <li>Review timing data for each node</li>
                        <li>Look for patterns in execution times</li>
                      </ol>
                    </div>
                  </div>

                  {/* Step 2: Setting Performance Baselines */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                      Step 2: Establishing Performance Baselines
                    </h4>
                    <p className="mb-4">
                      Before optimizing, you need to establish baseline measurements. This gives you a reference point 
                      to measure improvement against.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">📋 Baseline Checklist:</h5>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Record average execution time over 10 runs
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Identify slowest performing nodes
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Document peak memory usage
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Note any error rates or failures
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Record resource utilization patterns
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                      <h5 className="font-medium mb-2">📝 Sample Performance Log Template:</h5>
                      <pre className="text-xs overflow-x-auto whitespace-pre">
{`Date: 2024-01-15
Workflow: Customer Data Processing
Total Executions Analyzed: 10

Average Performance Metrics:
- Total Execution Time: 45.2 seconds
- Peak Memory Usage: 256 MB
- Success Rate: 98%

Node Performance Breakdown:
1. HTTP Request (API Call): 12.3s (27% of total time)
2. Data Transformation: 8.7s (19% of total time)  
3. Database Insert: 15.2s (34% of total time)
4. Email Notification: 2.1s (5% of total time)
5. Other nodes: 6.9s (15% of total time)

Identified Bottlenecks:
- Database Insert taking longest time
- HTTP Request has high variance (8-18s range)
- Memory spikes during data transformation`}
                      </pre>
                    </div>
                  </div>

                  {/* Step 3: Advanced Analysis Techniques */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                      Step 3: Advanced Analysis Techniques
                    </h4>
                    <p className="mb-4">
                      Beyond basic timing analysis, there are advanced techniques to gain deeper insights into 
                      your workflow performance.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">
                          🔄 Execution Pattern Analysis
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Time-of-day performance variations</li>
                          <li>• Load-based performance changes</li>
                          <li>• Data size impact on execution time</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                          📈 Trend Analysis
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Performance degradation over time</li>
                          <li>• Seasonal performance patterns</li>
                          <li>• Growth impact on performance</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                      <h5 className="font-medium mb-2">⚠️ Common Performance Warning Signs:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Execution times increasing over time without code changes</li>
                        <li>• High variation in execution times for identical inputs</li>
                        <li>• Memory usage continuously growing (memory leaks)</li>
                        <li>• Frequent timeouts or connection errors</li>
                        <li>• Queue backlog building up during peak times</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 4: Performance Monitoring Setup */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                      Step 4: Setting Up Continuous Performance Monitoring
                    </h4>
                    <p className="mb-4">
                      Manual analysis is good for initial assessment, but continuous monitoring helps you 
                      catch performance issues early and track optimization effectiveness.
                    </p>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">🛠️ Monitoring Tools Setup:</h5>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>n8n Webhook for Performance Data:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
{`// Add to end of workflow to capture performance data
const executionData = {
  workflowId: $workflow.id,
  executionId: $execution.id,
  startTime: $execution.startTime,
  endTime: new Date().toISOString(),
  duration: new Date() - new Date($execution.startTime),
  nodeCount: Object.keys($execution.data).length,
  success: $execution.finished,
  memoryUsage: process.memoryUsage()
};

// Send to monitoring endpoint
return executionData;`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">📊 Performance Dashboard Metrics:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <strong>Real-time Metrics:</strong>
                          <ul className="mt-1 space-y-1">
                            <li>• Current execution count</li>
                            <li>• Average response time</li>
                            <li>• Error rate</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Historical Trends:</strong>
                          <ul className="mt-1 space-y-1">
                            <li>• Performance over time</li>
                            <li>• Usage patterns</li>
                            <li>• Resource utilization</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Alerts & Thresholds:</strong>
                          <ul className="mt-1 space-y-1">
                            <li>• Execution time spikes</li>
                            <li>• Error rate increases</li>
                            <li>• Resource exhaustion</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">🚀 Ready for Next Steps?</h4>
                    <p className="mb-4">
                      Now that you understand how to analyze performance, you're ready to identify specific 
                      bottlenecks and start optimizing your workflows.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Performance Analysis Complete</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Bottleneck Identification</span>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'performance-step-2',
              title: 'Bottleneck Identification',
              description: 'Identify and understand performance bottlenecks',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Bottleneck Identification Mastery
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      A bottleneck is any component in your workflow that limits overall performance. Like a narrow section 
                      in a bottle that restricts liquid flow, workflow bottlenecks prevent your entire process from running 
                      at optimal speed. Identifying these constraints is crucial for effective optimization.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-red-500">
                      <h4 className="font-semibold mb-2">🎯 Bottleneck Identification Goals:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Locate the slowest components in your workflow</li>
                        <li>Understand why certain nodes take longer to execute</li>
                        <li>Identify resource constraints (CPU, memory, I/O, network)</li>
                        <li>Discover dependency chains that create sequential delays</li>
                        <li>Find inefficient data processing patterns</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 1: Systematic Bottleneck Detection */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Step 1: Systematic Bottleneck Detection
                    </h4>
                    <p className="mb-4">
                      Use a methodical approach to identify bottlenecks by analyzing execution data patterns and 
                      resource utilization across your workflow.
                    </p>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">🔍 Detection Methodology:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-sm mb-2">Time-Based Analysis:</h6>
                          <ul className="text-sm space-y-1">
                            <li>• Rank nodes by average execution time</li>
                            <li>• Look for nodes with high time variance</li>
                            <li>• Identify sequential dependency chains</li>
                            <li>• Find nodes that frequently timeout</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-sm mb-2">Resource-Based Analysis:</h6>
                          <ul className="text-sm space-y-1">
                            <li>• Monitor CPU usage spikes</li>
                            <li>• Track memory consumption patterns</li>
                            <li>• Analyze network I/O bottlenecks</li>
                            <li>• Check database connection limits</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">📊 Bottleneck Analysis Worksheet:</h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Node Name</th>
                              <th className="text-left p-2">Avg Time</th>
                              <th className="text-left p-2">% of Total</th>
                              <th className="text-left p-2">Issue Type</th>
                              <th className="text-left p-2">Priority</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            <tr className="border-b">
                              <td className="p-2">Database Query</td>
                              <td className="p-2">15.3s</td>
                              <td className="p-2">34%</td>
                              <td className="p-2">I/O Bound</td>
                              <td className="p-2 text-red-600">HIGH</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">API Call</td>
                              <td className="p-2">8.7s</td>
                              <td className="p-2">19%</td>
                              <td className="p-2">Network Latency</td>
                              <td className="p-2 text-orange-600">MED</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Data Transform</td>
                              <td className="p-2">6.2s</td>
                              <td className="p-2">14%</td>
                              <td className="p-2">CPU Intensive</td>
                              <td className="p-2 text-yellow-600">LOW</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Common Bottleneck Patterns */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Step 2: Recognizing Common Bottleneck Patterns
                    </h4>
                    <p className="mb-4">
                      Understanding typical bottleneck patterns helps you quickly identify and categorize 
                      performance issues in your workflows.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                        <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">
                          🚫 I/O Bottlenecks
                        </h5>
                        <p className="text-sm mb-2">When workflows wait for external resources</p>
                        <ul className="text-sm space-y-1">
                          <li>• Database queries taking too long</li>
                          <li>• API calls with high latency</li>
                          <li>• File system read/write operations</li>
                          <li>• Network connectivity issues</li>
                        </ul>
                        <div className="mt-2 text-xs bg-red-100 dark:bg-red-800 p-2 rounded">
                          <strong>Symptoms:</strong> High wait times, variable execution duration
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border-l-4 border-orange-500">
                        <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-300">
                          🔄 CPU Bottlenecks
                        </h5>
                        <p className="text-sm mb-2">When workflows are limited by processing power</p>
                        <ul className="text-sm space-y-1">
                          <li>• Complex data transformations</li>
                          <li>• Heavy computational logic</li>
                          <li>• Large dataset processing</li>
                          <li>• Inefficient algorithms</li>
                        </ul>
                        <div className="mt-2 text-xs bg-orange-100 dark:bg-orange-800 p-2 rounded">
                          <strong>Symptoms:</strong> High CPU usage, consistent execution times
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border-l-4 border-purple-500">
                        <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">
                          💾 Memory Bottlenecks
                        </h5>
                        <p className="text-sm mb-2">When workflows are constrained by available memory</p>
                        <ul className="text-sm space-y-1">
                          <li>• Processing large datasets in memory</li>
                          <li>• Memory leaks in long-running workflows</li>
                          <li>• Inefficient data structures</li>
                          <li>• Concurrent execution limits</li>
                        </ul>
                        <div className="mt-2 text-xs bg-purple-100 dark:bg-purple-800 p-2 rounded">
                          <strong>Symptoms:</strong> Memory usage spikes, out-of-memory errors
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                        <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                          🔗 Dependency Bottlenecks
                        </h5>
                        <p className="text-sm mb-2">When workflows are limited by sequential dependencies</p>
                        <ul className="text-sm space-y-1">
                          <li>• Unnecessary sequential execution</li>
                          <li>• Blocking operations that could be parallel</li>
                          <li>• Resource contention between nodes</li>
                          <li>• Waiting for external service responses</li>
                        </ul>
                        <div className="mt-2 text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded">
                          <strong>Symptoms:</strong> Low resource utilization, queue buildup
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Bottleneck Analysis Tools */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Step 3: Advanced Bottleneck Analysis Tools
                    </h4>
                    <p className="mb-4">
                      Use specialized tools and techniques to perform deep bottleneck analysis and 
                      understand the root causes of performance issues.
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">🛠️ n8n Bottleneck Analysis Script:</h5>
                      <pre className="text-xs overflow-x-auto bg-gray-100 dark:bg-gray-700 p-3 rounded">
{`// Add this JavaScript code node to analyze execution patterns
const executionData = $('previous_executions').all();
const analysis = {
  bottlenecks: [],
  patterns: {},
  recommendations: []
};

// Analyze node execution times
const nodeStats = {};
executionData.forEach(execution => {
  execution.data.forEach(node => {
    if (!nodeStats[node.name]) {
      nodeStats[node.name] = {
        times: [],
        errors: 0,
        totalRuns: 0
      };
    }
    nodeStats[node.name].times.push(node.executionTime);
    nodeStats[node.name].totalRuns++;
    if (node.error) nodeStats[node.name].errors++;
  });
});

// Identify bottlenecks
Object.entries(nodeStats).forEach(([nodeName, stats]) => {
  const avgTime = stats.times.reduce((a, b) => a + b, 0) / stats.times.length;
  const variance = stats.times.reduce((acc, time) => acc + Math.pow(time - avgTime, 2), 0) / stats.times.length;
  
  if (avgTime > 5000) { // More than 5 seconds average
    analysis.bottlenecks.push({
      node: nodeName,
      avgTime: avgTime,
      variance: variance,
      errorRate: stats.errors / stats.totalRuns,
      severity: avgTime > 15000 ? 'HIGH' : avgTime > 10000 ? 'MEDIUM' : 'LOW'
    });
  }
});

return analysis;`}
                      </pre>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">📈 Performance Profiling Checklist:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium mb-2">Execution Analysis:</h6>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Map out workflow execution flow
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Identify parallel execution opportunities
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Measure node-to-node transition times
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Document data flow patterns
                          </label>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2">Resource Analysis:</h6>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Monitor system resource usage
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Check external service response times
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Analyze queue and concurrency limits
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Review error rates and patterns
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Prioritization Matrix */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Step 4: Bottleneck Prioritization Matrix
                    </h4>
                    <p className="mb-4">
                      Not all bottlenecks are worth fixing immediately. Use this prioritization framework to 
                      focus your optimization efforts where they'll have the biggest impact.
                    </p>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                      <h5 className="font-medium mb-4 text-center">🎯 Impact vs Effort Matrix</h5>
                      <div className="grid grid-cols-2 gap-4 h-64">
                        <div className="bg-green-100 dark:bg-green-800 p-4 rounded border-2 border-green-300">
                          <div className="text-green-800 dark:text-green-200 font-medium text-sm mb-2">
                            HIGH IMPACT / LOW EFFORT
                          </div>
                          <div className="text-xs space-y-1">
                            <div>• Quick wins</div>
                            <div>• Do immediately</div>
                            <div>• Configuration changes</div>
                            <div>• Simple query optimizations</div>
                          </div>
                        </div>
                        <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded border-2 border-yellow-300">
                          <div className="text-yellow-800 dark:text-yellow-200 font-medium text-sm mb-2">
                            HIGH IMPACT / HIGH EFFORT
                          </div>
                          <div className="text-xs space-y-1">
                            <div>• Strategic projects</div>
                            <div>• Plan carefully</div>
                            <div>• Architecture changes</div>
                            <div>• Major refactoring</div>
                          </div>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded border-2 border-blue-300">
                          <div className="text-blue-800 dark:text-blue-200 font-medium text-sm mb-2">
                            LOW IMPACT / LOW EFFORT
                          </div>
                          <div className="text-xs space-y-1">
                            <div>• Fill-in tasks</div>
                            <div>• Do when available</div>
                            <div>• Minor optimizations</div>
                            <div>• Code cleanup</div>
                          </div>
                        </div>
                        <div className="bg-red-100 dark:bg-red-800 p-4 rounded border-2 border-red-300">
                          <div className="text-red-800 dark:text-red-200 font-medium text-sm mb-2">
                            LOW IMPACT / HIGH EFFORT
                          </div>
                          <div className="text-xs space-y-1">
                            <div>• Avoid these</div>
                            <div>• Questionable value</div>
                            <div>• Over-engineering</div>
                            <div>• Premature optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                      <h5 className="font-medium mb-2">📋 Bottleneck Scoring Template:</h5>
                      <div className="text-sm space-y-2">
                        <div><strong>Impact Score (1-10):</strong> Performance improvement potential</div>
                        <div><strong>Effort Score (1-10):</strong> Implementation complexity and time</div>
                        <div><strong>Priority Score:</strong> Impact ÷ Effort = Optimization Priority</div>
                        <div className="text-xs mt-2 p-2 bg-blue-100 dark:bg-blue-800 rounded">
                          <strong>Example:</strong> Database query optimization - Impact: 9, Effort: 3, Priority: 3.0 (High Priority)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">🎯 Bottleneck Analysis Complete!</h4>
                    <p className="mb-4">
                      You now have the skills to systematically identify, analyze, and prioritize performance 
                      bottlenecks in your n8n workflows. Ready to start implementing optimizations?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Bottleneck Identification Mastered</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Parallel Processing Setup</span>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'performance-step-3',
              title: 'Parallel Processing',
              description: 'Configure nodes for parallel execution',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <GitBranch className="h-5 w-5 mr-2" />
                      Parallel Processing Mastery
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Parallel processing allows multiple operations to run simultaneously, dramatically reducing 
                      total execution time. Instead of waiting for each task to complete sequentially, you can 
                      process multiple data streams or operations at once, maximizing resource utilization.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-green-500">
                      <h4 className="font-semibold mb-2">🚀 Parallel Processing Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Reduce total workflow execution time by 60-80%</li>
                        <li>Better utilize available CPU and memory resources</li>
                        <li>Process multiple data sources simultaneously</li>
                        <li>Improve throughput for batch operations</li>
                        <li>Enable real-time data processing patterns</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 1: Understanding n8n Parallel Execution */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      Step 1: Understanding n8n Parallel Execution
                    </h4>
                    <p className="mb-4">
                      n8n supports parallel execution at multiple levels. Understanding these different approaches 
                      helps you choose the right strategy for your specific use case.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                          🔀 Node-Level Parallelization
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Multiple nodes execute simultaneously</li>
                          <li>• No dependencies between parallel nodes</li>
                          <li>• Ideal for independent operations</li>
                          <li>• Automatic when nodes don't depend on each other</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">
                          📊 Item-Level Parallelization
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Process array items simultaneously</li>
                          <li>• Each item processed in parallel thread</li>
                          <li>• Perfect for batch operations</li>
                          <li>• Configure with node settings</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-500">
                      <h5 className="font-medium mb-2">⚙️ Parallel Execution Configuration:</h5>
                      <div className="text-sm space-y-2">
                        <div><strong>1. Node Settings:</strong> Enable "Execute Once" vs "Execute for Each Item"</div>
                        <div><strong>2. Batch Size:</strong> Configure how many items to process simultaneously</div>
                        <div><strong>3. Resource Limits:</strong> Set memory and CPU constraints</div>
                        <div><strong>4. Error Handling:</strong> Define behavior when parallel operations fail</div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Implementing Parallel Workflows */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      Step 2: Designing Parallel Workflow Patterns
                    </h4>
                    <p className="mb-4">
                      Learn proven patterns for implementing parallel processing in your n8n workflows.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">
                          🌟 Pattern 1: Fork-Join Processing
                        </h5>
                        <p className="text-sm mb-2">Split data into parallel streams, process independently, then merge results.</p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                          <strong>Example Workflow Structure:</strong>
                          <pre className="mt-1 whitespace-pre">
{`Trigger → Split Data → [Parallel Branch A: API Call → Transform]
                    ↓   [Parallel Branch B: Database Query → Format]
                    ↓   [Parallel Branch C: File Processing → Validate]
                    ↓
                Merge Results → Final Output`}
                          </pre>
                        </div>
                        <div className="mt-2 text-xs">
                          <strong>Use Cases:</strong> Multi-source data aggregation, parallel API calls, batch processing
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                          🔄 Pattern 2: Parallel Item Processing
                        </h5>
                        <p className="text-sm mb-2">Process each item in an array simultaneously rather than sequentially.</p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                          <strong>Configuration Example:</strong>
                          <pre className="mt-1 whitespace-pre">
{`// Node Settings
Execute: "Once for Each Item"
Batch Size: 10 (process 10 items at once)
Continue on Fail: true
Retry on Fail: 3

// Code Example
const items = $input.all();
const results = await Promise.all(
  items.map(async (item) => {
    // Process each item in parallel
    return await processItem(item.json);
  })
);
return results;`}
                          </pre>
                        </div>
                        <div className="mt-2 text-xs">
                          <strong>Use Cases:</strong> Bulk data processing, parallel API requests, image processing
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-300">
                          ⚡ Pattern 3: Pipeline Parallelization
                        </h5>
                        <p className="text-sm mb-2">Multiple workflow stages process different data batches simultaneously.</p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                          <strong>Implementation Strategy:</strong>
                          <pre className="mt-1 whitespace-pre">
{`Stage 1: Data Ingestion    [Batch 1] [Batch 2] [Batch 3]
Stage 2: Processing         [Batch 1] [Batch 2] [Batch 3]
Stage 3: Transformation     [Batch 1] [Batch 2] [Batch 3]
Stage 4: Output             [Batch 1] [Batch 2] [Batch 3]

Each stage processes different batches in parallel`}
                          </pre>
                        </div>
                        <div className="mt-2 text-xs">
                          <strong>Use Cases:</strong> ETL pipelines, streaming data processing, real-time analytics
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Configuration Best Practices */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      Step 3: Parallel Processing Configuration
                    </h4>
                    <p className="mb-4">
                      Proper configuration is crucial for optimal parallel processing performance. Learn how to 
                      tune your settings for maximum efficiency.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2">🎛️ Key Configuration Settings</h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Batch Size:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Small datasets: 5-10 items</li>
                              <li>• Medium datasets: 20-50 items</li>
                              <li>• Large datasets: 100+ items</li>
                              <li>• API calls: 3-5 concurrent requests</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Memory Limits:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Set per-node memory limits</li>
                              <li>• Monitor total workflow memory</li>
                              <li>• Use streaming for large data</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2">⚡ Performance Tuning</h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>CPU Optimization:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Balance parallel threads with CPU cores</li>
                              <li>• Avoid over-subscription</li>
                              <li>• Monitor CPU utilization</li>
                            </ul>
                          </div>
                          <div>
                            <strong>I/O Optimization:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Limit concurrent external calls</li>
                              <li>• Use connection pooling</li>
                              <li>• Implement backoff strategies</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                      <h5 className="font-medium mb-2">⚠️ Common Parallel Processing Pitfalls:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Resource Exhaustion:</strong> Too many parallel operations overwhelming system resources</li>
                        <li>• <strong>Race Conditions:</strong> Parallel operations interfering with shared resources</li>
                        <li>• <strong>Error Propagation:</strong> One failed parallel operation affecting entire workflow</li>
                        <li>• <strong>Memory Leaks:</strong> Parallel operations not properly cleaning up resources</li>
                        <li>• <strong>API Rate Limits:</strong> Exceeding external service limits with parallel calls</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 4: Monitoring and Testing */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      Step 4: Parallel Processing Monitoring & Testing
                    </h4>
                    <p className="mb-4">
                      Implement monitoring and testing strategies to ensure your parallel processing implementation 
                      is working efficiently and reliably.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">📊 Parallel Processing Metrics:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <strong>Performance Metrics:</strong>
                          <ul className="mt-1 space-y-1 text-xs">
                            <li>• Total execution time</li>
                            <li>• Parallel vs sequential comparison</li>
                            <li>• Resource utilization efficiency</li>
                            <li>• Throughput (items/second)</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Reliability Metrics:</strong>
                          <ul className="mt-1 space-y-1 text-xs">
                            <li>• Success rate per parallel thread</li>
                            <li>• Error correlation patterns</li>
                            <li>• Recovery time from failures</li>
                            <li>• Data consistency checks</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Resource Metrics:</strong>
                          <ul className="mt-1 space-y-1 text-xs">
                            <li>• Memory usage per thread</li>
                            <li>• CPU utilization patterns</li>
                            <li>• Network I/O distribution</li>
                            <li>• Queue depth and wait times</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">🧪 Testing Parallel Workflows:</h5>
                      <div className="space-y-3">
                        <div>
                          <h6 className="font-medium text-sm">Load Testing Strategy:</h6>
                          <ul className="text-xs space-y-1 mt-1">
                            <li>• Start with small batches and gradually increase</li>
                            <li>• Test with realistic data volumes</li>
                            <li>• Measure performance at different concurrency levels</li>
                            <li>• Identify the optimal batch size for your use case</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-sm">Error Handling Tests:</h6>
                          <ul className="text-xs space-y-1 mt-1">
                            <li>• Simulate failures in parallel operations</li>
                            <li>• Test partial failure scenarios</li>
                            <li>• Verify data consistency after errors</li>
                            <li>• Validate retry and recovery mechanisms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">🚀 Parallel Processing Implemented!</h4>
                    <p className="mb-4">
                      You've learned how to implement parallel processing in n8n workflows. This can dramatically 
                      reduce execution times and improve resource utilization. Next, let's optimize memory usage!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Parallel Processing Mastered</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Memory Optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'performance-step-4',
              title: 'Memory Optimization',
              description: 'Optimize memory usage and data handling',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Memory Optimization Mastery
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Memory optimization is critical for n8n workflows, especially when processing large datasets 
                      or running long-term automated processes. Poor memory management can lead to out-of-memory 
                      errors, degraded performance, and workflow failures. Learn to optimize memory usage effectively.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-purple-500">
                      <h4 className="font-semibold mb-2">💾 Memory Optimization Goals:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Reduce peak memory consumption by 40-60%</li>
                        <li>Prevent out-of-memory errors and crashes</li>
                        <li>Enable processing of larger datasets</li>
                        <li>Improve workflow stability and reliability</li>
                        <li>Optimize garbage collection performance</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 1: Understanding Memory Usage Patterns */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                      Step 1: Understanding n8n Memory Usage Patterns
                    </h4>
                    <p className="mb-4">
                      Before optimizing memory usage, you need to understand how n8n consumes memory and 
                      identify the primary sources of memory consumption in your workflows.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">
                          📊 Memory Usage Sources
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Data Storage:</strong> Workflow execution data</li>
                          <li>• <strong>Node Operations:</strong> Processing logic and buffers</li>
                          <li>• <strong>External Connections:</strong> API responses and downloads</li>
                          <li>• <strong>Caching:</strong> Temporary data and computed results</li>
                        </ul>
                      </div>
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-rose-700 dark:text-rose-300">
                          ⚠️ Memory Leak Patterns
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Accumulating data across iterations</li>
                          <li>• Unclosed database connections</li>
                          <li>• Large objects not being garbage collected</li>
                          <li>• Event listeners not properly removed</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                      <h5 className="font-medium mb-2">🔍 Memory Usage Analysis Script:</h5>
                      <pre className="text-xs overflow-x-auto bg-gray-100 dark:bg-gray-700 p-3 rounded">
{`// Add this to a Code node to monitor memory usage
const memoryUsage = process.memoryUsage();
const memoryInfo = {
  timestamp: new Date().toISOString(),
  rss: Math.round(memoryUsage.rss / 1024 / 1024), // Resident Set Size (MB)
  heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
  heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
  external: Math.round(memoryUsage.external / 1024 / 1024),
  arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024),
  workflowId: $workflow.id,
  nodeCount: Object.keys($execution.data).length
};

// Log memory usage for analysis
console.log('Memory Usage:', memoryInfo);
return memoryInfo;`}
                      </pre>
                    </div>
                  </div>

                  {/* Step 2: Data Streaming and Chunking */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                      Step 2: Implementing Data Streaming & Chunking
                    </h4>
                    <p className="mb-4">
                      One of the most effective memory optimization techniques is to process data in smaller chunks 
                      rather than loading entire datasets into memory at once.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                          🔄 Streaming Data Processing
                        </h5>
                        <p className="text-sm mb-2">Process data as it flows through your workflow without storing it all in memory.</p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                          <strong>Example: Streaming File Processing</strong>
                          <pre className="mt-1 whitespace-pre">
{`// Instead of loading entire file into memory
const fileData = await fs.readFile(filePath); // ❌ Loads entire file

// Use streaming approach
const stream = fs.createReadStream(filePath);
stream.on('data', (chunk) => {
  // Process chunk by chunk ✅
  processChunk(chunk);
});

// n8n Configuration:
// Set "Execute Once" to false
// Set batch size to 100-1000 items
// Enable "Continue on Fail" for resilience`}
                          </pre>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                          📦 Chunking Large Datasets
                        </h5>
                        <p className="text-sm mb-2">Break large datasets into manageable chunks for processing.</p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                          <strong>Implementation Example:</strong>
                          <pre className="mt-1 whitespace-pre">
{`// Chunking utility function
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Usage in n8n workflow
const largeDataset = $input.all();
const chunkSize = 500; // Process 500 items at a time
const chunks = chunkArray(largeDataset, chunkSize);

// Process each chunk separately
for (const chunk of chunks) {
  await processChunk(chunk);
  // Memory cleanup between chunks
  if (global.gc) global.gc();
}

return { processed: chunks.length * chunkSize };`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Memory-Efficient Data Structures */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                      Step 3: Choosing Memory-Efficient Data Structures
                    </h4>
                    <p className="mb-4">
                      The choice of data structures significantly impacts memory consumption. Learn to select 
                      the most memory-efficient options for your use cases.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-emerald-700 dark:text-emerald-300">
                          ✅ Memory-Efficient Choices
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Arrays vs Objects:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Use arrays for ordered data (lower overhead)</li>
                              <li>• Avoid sparse arrays (waste memory)</li>
                              <li>• Use typed arrays for numeric data</li>
                            </ul>
                          </div>
                          <div>
                            <strong>String Handling:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Use template literals efficiently</li>
                              <li>• Avoid string concatenation in loops</li>
                              <li>• Use Buffer for binary data</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">
                          ❌ Memory-Intensive Patterns
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Avoid These:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Deep object nesting (increases overhead)</li>
                              <li>• Duplicate data across objects</li>
                              <li>• Large JSON.stringify operations</li>
                              <li>• Unnecessary object cloning</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                      <h5 className="font-medium mb-2">🔧 Memory Optimization Techniques:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <strong>Object Pooling:</strong>
                          <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded">
{`// Reuse objects instead of creating new ones
const objectPool = [];
function getObject() {
  return objectPool.pop() || {};
}
function releaseObject(obj) {
  Object.keys(obj).forEach(key => delete obj[key]);
  objectPool.push(obj);
}`}
                          </pre>
                        </div>
                        <div>
                          <strong>Lazy Loading:</strong>
                          <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded">
{`// Load data only when needed
class LazyData {
  get data() {
    if (!this._data) {
      this._data = this.loadData();
    }
    return this._data;
  }
}`}
                          </pre>
                        </div>
                        <div>
                          <strong>WeakMap Usage:</strong>
                          <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded">
{`// Use WeakMap for temporary associations
const cache = new WeakMap();
function getCachedData(obj) {
  if (!cache.has(obj)) {
    cache.set(obj, computeData(obj));
  }
  return cache.get(obj);
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Garbage Collection Optimization */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                      Step 4: Garbage Collection Optimization
                    </h4>
                    <p className="mb-4">
                      Understanding and optimizing garbage collection can significantly improve memory performance 
                      and reduce memory-related pauses in your workflows.
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">🗑️ Garbage Collection Best Practices:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium mb-2">Minimize GC Pressure:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Reduce object creation in loops</li>
                            <li>• Reuse objects when possible</li>
                            <li>• Use primitive types over objects</li>
                            <li>• Avoid creating unnecessary closures</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2">Manual Memory Management:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Explicitly null unused references</li>
                            <li>• Remove event listeners</li>
                            <li>• Clear intervals and timeouts</li>
                            <li>• Close database connections</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded">
                      <h5 className="font-medium mb-2">⚙️ n8n Memory Management Code:</h5>
                      <pre className="text-xs overflow-x-auto bg-gray-100 dark:bg-gray-700 p-3 rounded">
{`// Memory cleanup utility for n8n workflows
function performMemoryCleanup() {
  // Clear large variables
  if (typeof largeDataset !== 'undefined') {
    largeDataset = null;
  }
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // Clear Node.js require cache if needed
  Object.keys(require.cache).forEach(key => {
    if (key.includes('temp-module')) {
      delete require.cache[key];
    }
  });
}

// Use in workflow
const processData = (data) => {
  try {
    // Process your data
    const result = heavyProcessing(data);
    return result;
  } finally {
    // Always cleanup
    performMemoryCleanup();
  }
};`}
                      </pre>
                    </div>
                  </div>

                  {/* Step 5: Memory Monitoring and Alerts */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                      Step 5: Memory Monitoring & Alerting
                    </h4>
                    <p className="mb-4">
                      Implement comprehensive memory monitoring to detect issues early and maintain optimal 
                      memory usage across your n8n workflows.
                    </p>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">📊 Memory Monitoring Dashboard:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <strong>Real-time Metrics:</strong>
                          <ul className="mt-1 space-y-1 text-xs">
                            <li>• Current memory usage</li>
                            <li>• Memory usage trends</li>
                            <li>• Garbage collection frequency</li>
                            <li>• Memory leak detection</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Alert Thresholds:</strong>
                          <ul className="mt-1 space-y-1 text-xs">
                                                          <li>• Memory usage &gt; 80%</li>
                            <li>• Rapid memory growth</li>
                            <li>• GC pause time increases</li>
                            <li>• Out of memory errors</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Optimization Triggers:</strong>
                          <ul className="mt-1 space-y-1 text-xs">
                            <li>• Automatic cleanup scripts</li>
                            <li>• Workflow restart triggers</li>
                            <li>• Resource scaling alerts</li>
                            <li>• Performance degradation warnings</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">🔧 Memory Optimization Checklist:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Implement data streaming for large datasets
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Use appropriate data structures
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Add memory usage monitoring
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Implement cleanup routines
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Set up memory alerts
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Test with realistic data volumes
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Profile memory usage patterns
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Document memory requirements
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">💾 Memory Optimization Complete!</h4>
                    <p className="mb-4">
                      You've mastered memory optimization techniques for n8n workflows. Your workflows will now 
                      use memory more efficiently, handle larger datasets, and run more reliably. Next up: data flow optimization!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Memory Optimization Mastered</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Data Flow Optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'performance-step-5',
              title: 'Data Flow Optimization',
              description: 'Streamline data processing and reduce overhead',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <GitBranch className="h-5 w-5 mr-2" />
                      Data Flow Optimization
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Data flow optimization focuses on streamlining how data moves through your n8n workflows. 
                      By minimizing unnecessary transformations, reducing data transfer overhead, and optimizing 
                      processing pipelines, you can significantly improve workflow performance.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-cyan-500">
                      <h4 className="font-semibold mb-2">🌊 Data Flow Optimization Goals:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Reduce unnecessary data transformations by 50-70%</li>
                        <li>Minimize data transfer between nodes</li>
                        <li>Optimize data processing pipelines</li>
                        <li>Eliminate redundant operations and computations</li>
                        <li>Improve overall workflow execution efficiency</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 1: Data Pipeline Analysis */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                      Step 1: Analyzing Your Data Pipeline
                    </h4>
                    <p className="mb-4">
                      Understanding your current data flow is the first step to optimization. Map out how data 
                      moves through your workflow to identify bottlenecks and inefficiencies.
                    </p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">🗺️ Data Flow Mapping Checklist:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium mb-2">Input Analysis:</h6>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Document data sources and formats
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Measure input data volume and frequency
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Identify data quality issues
                          </label>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2">Processing Analysis:</h6>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Map transformation steps
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Identify duplicate transformations
                          </label>
                          <label className="flex items-center mb-1">
                            <input type="checkbox" className="mr-2" />
                            Document output requirements
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">📊 Data Flow Analysis Script:</h5>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                        <pre>
{`// Add this to analyze data flow in your workflow
const dataFlowAnalysis = {
  inputAnalysis: {
    nodeId: $node.id,
    dataSize: JSON.stringify($input.all()).length,
    itemCount: $input.all().length,
    dataTypes: $input.all().map(item => typeof item.json),
    timestamp: new Date().toISOString()
  },
  transformationSteps: [],
  outputMetrics: {}
};

// Analyze data transformations
const inputData = $input.all();
const transformedData = inputData.map(item => {
  // Track your transformation logic here
  const transformed = transformItem(item);
  dataFlowAnalysis.transformationSteps.push({
    operation: 'transform',
    inputSize: JSON.stringify(item).length,
    outputSize: JSON.stringify(transformed).length
  });
  return transformed;
});

dataFlowAnalysis.outputMetrics = {
  finalSize: JSON.stringify(transformedData).length,
  compressionRatio: dataFlowAnalysis.inputAnalysis.dataSize / JSON.stringify(transformedData).length
};

return dataFlowAnalysis;`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Eliminating Redundant Operations */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                      Step 2: Eliminating Redundant Operations
                    </h4>
                    <p className="mb-4">
                      Identify and remove unnecessary data transformations, duplicate operations, 
                      and redundant processing steps to streamline your workflow.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                        <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">
                          ❌ Common Redundant Patterns
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Multiple format conversions (JSON ↔ String ↔ Object)</li>
                          <li>• Duplicate data validation in multiple nodes</li>
                          <li>• Unnecessary data copying and cloning</li>
                          <li>• Repeated API calls for the same data</li>
                          <li>• Multiple sorting or filtering operations</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                          ✅ Optimization Strategies
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Consolidation:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Combine multiple transformations into one node</li>
                              <li>• Merge similar processing operations</li>
                              <li>• Use batch operations instead of loops</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Caching:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Cache frequently accessed data</li>
                              <li>• Store computed results for reuse</li>
                              <li>• Implement memoization for expensive operations</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Data Compression and Streaming */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                      Step 3: Data Compression &amp; Streaming Optimization
                    </h4>
                    <p className="mb-4">
                      Optimize how data is transferred and stored throughout your workflow using compression 
                      and streaming techniques to reduce memory usage and improve performance.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">🗜️ Compression Techniques:</h5>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                        <pre>
{`// Data compression utilities for n8n workflows
const zlib = require('zlib');

// Compress large data objects
function compressData(data) {
  const jsonString = JSON.stringify(data);
  const compressed = zlib.gzipSync(jsonString);
  return {
    data: compressed.toString('base64'),
    originalSize: jsonString.length,
    compressedSize: compressed.length,
    compressionRatio: (jsonString.length / compressed.length).toFixed(2)
  };
}

// Decompress data when needed
function decompressData(compressedData) {
  const buffer = Buffer.from(compressedData.data, 'base64');
  const decompressed = zlib.gunzipSync(buffer);
  return JSON.parse(decompressed.toString());
}

// Usage in workflow
const largeDataset = $input.all();
if (largeDataset.length &gt; 1000) {
  const compressed = compressData(largeDataset);
  console.log(\`Compression saved \${(100 - (compressed.compressedSize / compressed.originalSize * 100)).toFixed(1)}% space\`);
  return compressed;
}
return largeDataset;`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                      <h5 className="font-medium mb-2">🌊 Streaming Optimization Best Practices:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Process data in smaller, manageable chunks</li>
                        <li>• Use streaming APIs for large file operations</li>
                        <li>• Implement backpressure handling for data flow control</li>
                        <li>• Pipeline operations to overlap processing and I/O</li>
                        <li>• Use transform streams for on-the-fly data modification</li>
                      </ul>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">🌊 Data Flow Optimized!</h4>
                    <p className="mb-4">
                      Your data flow is now streamlined for maximum efficiency. You've eliminated redundancies, 
                      optimized transformations, and implemented efficient data transfer strategies.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Data Flow Optimization Complete</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Node Configuration Tuning</span>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'performance-step-6',
              title: 'Node Configuration Tuning',
              description: 'Optimize individual node settings for performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Node Configuration Tuning
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Node configuration tuning involves optimizing individual node settings to maximize performance 
                      and efficiency. Each node type has specific configuration options that can significantly impact 
                      overall workflow performance when properly tuned.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-orange-500">
                      <h4 className="font-semibold mb-2">⚙️ Node Tuning Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Reduce individual node execution time by 30-50%</li>
                        <li>Optimize resource usage for each operation</li>
                        <li>Improve reliability through proper timeout settings</li>
                        <li>Enable better error handling and recovery</li>
                        <li>Maximize throughput for high-volume operations</li>
                      </ul>
                    </div>
                  </div>

                  {/* HTTP Request Node Optimization */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      HTTP Request Node Optimization
                    </h4>
                    <p className="mb-4">
                      HTTP Request nodes are often performance bottlenecks. Proper configuration can dramatically 
                      improve API call performance and reliability.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                          🚀 Performance Settings
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Timeout:</strong> Set to 30-60 seconds for APIs</li>
                          <li>• <strong>Keep-Alive:</strong> Enable for multiple requests</li>
                          <li>• <strong>Connection Pooling:</strong> Use for high-volume</li>
                          <li>• <strong>Compression:</strong> Enable gzip/deflate</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                          🔄 Retry Configuration
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Max Retries:</strong> 3-5 for external APIs</li>
                          <li>• <strong>Retry Delay:</strong> Exponential backoff</li>
                          <li>• <strong>Retry Conditions:</strong> Network errors only</li>
                          <li>• <strong>Circuit Breaker:</strong> For repeated failures</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded">
                      <h5 className="font-medium mb-2">📝 HTTP Node Configuration Example:</h5>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                        <pre>
{`// Optimized HTTP Request Node Settings
{
  "url": "https://api.example.com/data",
  "method": "GET",
  "timeout": 45000,  // 45 seconds
  "headers": {
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  },
  "options": {
    "followRedirect": true,
    "followAllRedirects": false,
    "maxRedirects": 3,
    "pool": {
      "maxSockets": 50
    },
    "agent": {
      "keepAlive": true,
      "keepAliveMsecs": 30000
    }
  },
  "retry": {
    "limit": 3,
    "delay": 1000,
    "factor": 2,
    "methods": ["GET", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"]
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Database Node Optimization */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Database Node Optimization
                    </h4>
                    <p className="mb-4">
                      Database operations can be major performance bottlenecks. Optimize connection settings, 
                      query configuration, and resource management for better performance.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-cyan-700 dark:text-cyan-300">
                          🗄️ Connection Pool Settings
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Pool Configuration:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Min Pool Size: 2-5 connections</li>
                              <li>• Max Pool Size: 10-20 connections</li>
                              <li>• Idle Timeout: 30 minutes</li>
                              <li>• Connection Timeout: 30 seconds</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Query Optimization:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Use prepared statements</li>
                              <li>• Limit result sets with LIMIT</li>
                              <li>• Use appropriate indexes</li>
                              <li>• Batch multiple operations</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2">💡 Database Performance Tips:</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Use connection pooling for multiple database operations</li>
                          <li>• Implement query result caching for frequently accessed data</li>
                          <li>• Use batch operations for bulk inserts/updates</li>
                          <li>• Configure appropriate transaction isolation levels</li>
                          <li>• Monitor and optimize slow queries regularly</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Code Node Optimization */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Code Node Optimization
                    </h4>
                    <p className="mb-4">
                      Code nodes offer the most flexibility but require careful optimization to avoid 
                      performance issues and memory leaks.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded mb-4">
                      <h5 className="font-medium mb-2">⚡ Code Performance Best Practices:</h5>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
                        <pre>
{`// Optimized Code Node Implementation
// 1. Efficient data processing
const processItems = (items) => {
  // Use built-in array methods for better performance
  return items
    .filter(item => item.status === 'active')
    .map(item => ({
      id: item.id,
      processedAt: new Date().toISOString(),
      data: transformData(item.data)
    }));
};

// 2. Memory management
const processLargeDataset = (dataset) => {
  const chunkSize = 1000;
  const results = [];
  
  for (let i = 0; i < dataset.length; i += chunkSize) {
    const chunk = dataset.slice(i, i + chunkSize);
    const processed = processChunk(chunk);
    results.push(...processed);
    
    // Force garbage collection for large datasets
    if (global.gc && i % 5000 === 0) {
      global.gc();
    }
  }
  
  return results;
};

// 3. Error handling with performance consideration
const robustOperation = async (item) => {
  try {
    return await expensiveOperation(item);
  } catch (error) {
    // Log error without expensive operations
    console.error(\`Operation failed for item \${item.id}: \${error.message}\`);
    return null;
  }
};`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border-l-4 border-red-500">
                      <h5 className="font-medium mb-2">❌ Code Node Anti-Patterns to Avoid:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Synchronous operations that block the event loop</li>
                        <li>• Memory leaks from unreleased resources or listeners</li>
                        <li>• Inefficient loops and nested iterations</li>
                        <li>• Large object creations inside loops</li>
                        <li>• Missing error handling that can crash workflows</li>
                      </ul>
                    </div>
                  </div>

                  {/* Configuration Checklist */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                      Node Configuration Checklist
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">HTTP Nodes:</h5>
                        <div className="space-y-1 text-sm">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Configure appropriate timeouts
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Enable connection keep-alive
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Set up retry logic
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Configure compression
                          </label>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Database Nodes:</h5>
                        <div className="space-y-1 text-sm">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Set up connection pooling
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Optimize query performance
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Implement proper indexing
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Use batch operations
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">⚙️ Node Configuration Optimized!</h4>
                    <p className="mb-4">
                      Your individual nodes are now tuned for optimal performance. Each node type has been 
                      configured with best practices for maximum efficiency and reliability.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Node Configuration Complete</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Performance Metrics</span>
                    </div>
                  </div>
                </div>
              </div>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <BarChart2 className="h-5 w-5 mr-2" />
                        Performance Metrics & Monitoring Mastery
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Performance metrics are the key to understanding how your n8n workflows perform in real-world conditions. 
                        Without proper metrics collection and monitoring, you're flying blind when it comes to optimization opportunities 
                        and potential issues. Learn to set up comprehensive performance monitoring that gives you actionable insights.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-indigo-500">
                        <h4 className="font-semibold mb-2">🎯 Performance Metrics Goals:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Implement real-time performance monitoring with custom dashboards</li>
                          <li>Set up intelligent alerting for performance degradation</li>
                          <li>Track historical performance trends and patterns</li>
                          <li>Monitor resource utilization and capacity planning</li>
                          <li>Create automated performance reports and analytics</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 1: Core Performance Metrics */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        Step 1: Essential Performance Metrics Collection
                      </h4>
                      <p className="mb-4">
                        Start by collecting the fundamental metrics that give you insight into workflow performance. 
                        These metrics form the foundation of your monitoring strategy.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                            ⏱️ Execution Metrics
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• <strong>Total Execution Time:</strong> End-to-end workflow duration</li>
                            <li>• <strong>Node Execution Time:</strong> Time spent in each individual node</li>
                            <li>• <strong>Queue Wait Time:</strong> Time waiting in execution queue</li>
                            <li>• <strong>Execution Frequency:</strong> How often workflows run</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                            📊 Resource Metrics
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• <strong>Memory Usage:</strong> Peak and average memory consumption</li>
                            <li>• <strong>CPU Utilization:</strong> Processing power usage patterns</li>
                            <li>• <strong>Network I/O:</strong> Data transfer rates and volumes</li>
                            <li>• <strong>Concurrent Executions:</strong> Number of parallel workflows</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded border-l-4 border-purple-500">
                        <h5 className="font-medium mb-2">🔧 Metrics Collection Implementation:</h5>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <pre>{`// Add this to a Code node at the end of your workflow
const performanceMetrics = {
  // Basic execution metrics
  executionId: $execution.id,
  workflowId: $workflow.id,
  workflowName: $workflow.name,
  startTime: $execution.startTime,
  endTime: new Date().toISOString(),
  
  // Calculate execution duration
  totalDuration: new Date() - new Date($execution.startTime),
  
  // Node-level metrics
  nodeCount: Object.keys($execution.data).length,
  nodeMetrics: Object.entries($execution.data).map(([nodeId, nodeData]) => ({
    nodeId,
    nodeName: nodeData.node?.name || 'Unknown',
    executionTime: nodeData.endTime ? 
      new Date(nodeData.endTime) - new Date(nodeData.startTime) : null,
    dataSize: JSON.stringify(nodeData.data).length,
    success: !nodeData.error
  })),
  
  // Resource metrics
  memoryUsage: process.memoryUsage(),
  timestamp: new Date().toISOString(),
  
  // Success/failure tracking
  success: $execution.finished && !$execution.stoppedAt,
  errorCount: Object.values($execution.data)
    .filter(node => node.error).length,
  
  // Data volume metrics
  totalDataProcessed: Object.values($execution.data)
    .reduce((total, node) => {
      return total + (Array.isArray(node.data?.main?.[0]) ? 
        node.data.main[0].length : 0);
    }, 0)
};

// Send metrics to your monitoring system
return performanceMetrics;`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Real-time Monitoring Setup */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        Step 2: Real-time Performance Dashboard Setup
                      </h4>
                      <p className="mb-4">
                        Create a comprehensive dashboard that gives you real-time visibility into your workflow performance. 
                        This dashboard should provide both high-level overview and detailed drill-down capabilities.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-emerald-700 dark:text-emerald-300">
                            📈 Dashboard Components
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong>Overview Panel:</strong>
                              <ul className="text-xs mt-1 space-y-1">
                                <li>• Current execution count</li>
                                <li>• Average response time</li>
                                <li>• Success rate percentage</li>
                                <li>• Queue depth</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Performance Trends:</strong>
                              <ul className="text-xs mt-1 space-y-1">
                                <li>• Execution time over time</li>
                                <li>• Resource usage patterns</li>
                                <li>• Error rate trends</li>
                                <li>• Throughput analytics</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Resource Monitoring:</strong>
                              <ul className="text-xs mt-1 space-y-1">
                                <li>• Memory usage graphs</li>
                                <li>• CPU utilization charts</li>
                                <li>• Network I/O metrics</li>
                                <li>• Capacity utilization</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🛠️ Webhook-based Monitoring Setup:</h5>
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                            <pre>{`// Webhook payload for real-time monitoring
const monitoringPayload = {
  timestamp: new Date().toISOString(),
  source: 'n8n-workflow',
  event_type: 'workflow_execution_complete',
  
  // Core metrics
  metrics: {
    execution_time_ms: totalDuration,
    memory_used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    cpu_usage_percent: process.cpuUsage(),
    success_rate: success ? 1 : 0,
    
    // Performance indicators
    throughput_items_per_second: totalDataProcessed / (totalDuration / 1000),
    queue_time_ms: queueStartTime ? startTime - queueStartTime : 0,
    
    // Resource efficiency
    memory_efficiency: totalDataProcessed / (process.memoryUsage().heapUsed / 1024 / 1024),
    execution_efficiency: totalDuration / nodeCount
  },
  
  // Contextual data
  workflow: {
    id: $workflow.id,
    name: $workflow.name,
    version: $workflow.version,
    node_count: nodeCount,
    complexity_score: calculateComplexityScore()
  },
  
  // Environmental context
  environment: {
    n8n_version: $env.N8N_VERSION,
    instance_id: $env.INSTANCE_ID,
    deployment_type: $env.DEPLOYMENT_TYPE
  }
};

// Send to monitoring endpoint
await $http.request({
  method: 'POST',
  url: 'https://your-monitoring-endpoint.com/metrics',
  body: monitoringPayload,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + $env.MONITORING_TOKEN
  }
});`}</pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Intelligent Alerting */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        Step 3: Intelligent Performance Alerting
                      </h4>
                      <p className="mb-4">
                        Set up smart alerts that notify you of performance issues before they impact your users. 
                        Avoid alert fatigue by implementing intelligent thresholds and escalation policies.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                            🚨 Alert Categories
                          </h5>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Critical:</strong> Workflow failures, severe performance degradation</li>
                            <li>• <strong>Warning:</strong> Performance threshold breaches, resource constraints</li>
                            <li>• <strong>Info:</strong> Performance trends, capacity planning insights</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">
                            ⏱️ Threshold Examples
                          </h5>
                                                      <ul className="text-sm space-y-2">
                              <li>• <strong>Execution Time:</strong> &gt;2x baseline average</li>
                              <li>• <strong>Error Rate:</strong> &gt;5% in 15-minute window</li>
                              <li>• <strong>Memory Usage:</strong> &gt;80% of available</li>
                              <li>• <strong>Queue Depth:</strong> &gt;50 pending workflows</li>
                            </ul>
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border-l-4 border-orange-500">
                        <h5 className="font-medium mb-2">📢 Smart Alerting Implementation:</h5>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <pre>{`// Intelligent alerting logic
const checkPerformanceThresholds = (metrics, baseline) => {
  const alerts = [];
  
  // Dynamic threshold calculation (baseline + standard deviation)
  const executionTimeThreshold = baseline.avgExecutionTime + (2 * baseline.stdDevExecutionTime);
  const memoryThreshold = baseline.maxMemory * 0.8;
  const errorRateThreshold = 0.05; // 5%
  
  // Execution time alert
  if (metrics.execution_time_ms > executionTimeThreshold) {
    alerts.push({
      type: 'warning',
      severity: metrics.execution_time_ms > (executionTimeThreshold * 1.5) ? 'critical' : 'warning',
      message: \`Execution time (\${metrics.execution_time_ms}ms) exceeded threshold (\${executionTimeThreshold}ms)\`,
      metric: 'execution_time',
      value: metrics.execution_time_ms,
      threshold: executionTimeThreshold,
      impact: 'high',
      recommendations: [
        'Check for bottlenecks in slow nodes',
        'Review recent workflow changes',
        'Consider parallel processing optimization'
      ]
    });
  }
  
  // Memory usage alert
  if (metrics.memory_used_mb > memoryThreshold) {
    alerts.push({
      type: 'warning',
      severity: 'warning',
      message: \`Memory usage (\${metrics.memory_used_mb}MB) approaching limits\`,
      metric: 'memory_usage',
      value: metrics.memory_used_mb,
      threshold: memoryThreshold,
      impact: 'medium',
      recommendations: [
        'Implement data streaming for large datasets',
        'Add memory cleanup between operations',
        'Consider workflow splitting'
      ]
    });
  }
  
  // Error rate tracking (requires historical data)
  if (metrics.error_rate > errorRateThreshold) {
    alerts.push({
      type: 'error',
      severity: 'critical',
      message: \`Error rate (\${(metrics.error_rate * 100).toFixed(1)}%) exceeded threshold\`,
      metric: 'error_rate',
      value: metrics.error_rate,
      threshold: errorRateThreshold,
      impact: 'critical',
      recommendations: [
        'Review error logs for common patterns',
        'Implement retry mechanisms',
        'Add fallback workflows'
      ]
    });
  }
  
  return alerts;
};

// Send alerts if any thresholds breached
const alerts = checkPerformanceThresholds(currentMetrics, baselineMetrics);
if (alerts.length > 0) {
  await sendAlerts(alerts);
}`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Historical Analytics */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        Step 4: Historical Performance Analytics
                      </h4>
                      <p className="mb-4">
                        Historical analysis helps you understand performance trends, identify patterns, and make 
                        data-driven optimization decisions. Set up comprehensive analytics for long-term insights.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-violet-700 dark:text-violet-300">
                            📊 Analytics Dimensions
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Time-based Analysis:</strong>
                              <ul className="text-xs mt-1 space-y-1">
                                <li>• Hourly performance patterns</li>
                                <li>• Daily/weekly trends</li>
                                <li>• Seasonal variations</li>
                                <li>• Growth impact on performance</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Workflow Analysis:</strong>
                              <ul className="text-xs mt-1 space-y-1">
                                <li>• Per-workflow performance</li>
                                <li>• Node-level optimization opportunities</li>
                                <li>• Cross-workflow resource competition</li>
                                <li>• Workflow complexity impact</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📈 Performance Trend Analysis:</h5>
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                            <pre>{`// Performance trend calculation
const calculatePerformanceTrends = (historicalData, timeWindow = '7d') => {
  const trends = {
    execution_time: {
      current: calculateAverage(historicalData.recent.execution_times),
      previous: calculateAverage(historicalData.previous.execution_times),
      trend: 'stable',
      change_percent: 0,
      confidence: 0.95
    },
    
    success_rate: {
      current: calculateSuccessRate(historicalData.recent),
      previous: calculateSuccessRate(historicalData.previous),
      trend: 'stable',
      change_percent: 0,
      confidence: 0.95
    },
    
    resource_usage: {
      memory: {
        current: calculateAverage(historicalData.recent.memory_usage),
        trend: calculateTrend(historicalData.recent.memory_usage),
        projection: projectResourceUsage(historicalData.recent.memory_usage)
      },
      cpu: {
        current: calculateAverage(historicalData.recent.cpu_usage),
        trend: calculateTrend(historicalData.recent.cpu_usage),
        projection: projectResourceUsage(historicalData.recent.cpu_usage)
      }
    }
  };
  
  // Calculate trend direction and significance
  Object.keys(trends).forEach(metric => {
    if (trends[metric].current && trends[metric].previous) {
      const change = ((trends[metric].current - trends[metric].previous) / trends[metric].previous) * 100;
      trends[metric].change_percent = change;
      
      if (Math.abs(change) > 10) {
        trends[metric].trend = change > 0 ? 'increasing' : 'decreasing';
      }
    }
  });
  
  return trends;
};

// Generate performance insights
const generateInsights = (trends) => {
  const insights = [];
  
  if (trends.execution_time.trend === 'increasing' && trends.execution_time.change_percent > 20) {
    insights.push({
      type: 'performance_degradation',
      severity: 'high',
      message: 'Execution time has increased by ' + trends.execution_time.change_percent.toFixed(1) + '% over the past week',
      recommendations: [
        'Review recent workflow changes',
        'Check for new bottlenecks',
        'Consider infrastructure scaling'
      ]
    });
  }
  
  if (trends.resource_usage.memory.trend === 'increasing') {
    insights.push({
      type: 'resource_trend',
      severity: 'medium',
      message: 'Memory usage is trending upward',
      projection: trends.resource_usage.memory.projection,
      recommendations: [
        'Monitor for memory leaks',
        'Implement memory optimization',
        'Plan for capacity expansion'
      ]
    });
  }
  
  return insights;
};`}</pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 5: Automated Reporting */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        Step 5: Automated Performance Reporting
                      </h4>
                      <p className="mb-4">
                        Set up automated reports that provide regular insights into your workflow performance. 
                        These reports should be actionable and help drive optimization decisions.
                      </p>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded border-l-4 border-teal-500">
                        <h5 className="font-medium mb-2">📄 Weekly Performance Report Template:</h5>
                        <div className="space-y-2 text-sm">
                          <div><strong>Executive Summary:</strong> High-level performance overview</div>
                          <div><strong>Key Metrics:</strong> Execution time, success rate, resource usage</div>
                          <div><strong>Trends Analysis:</strong> Week-over-week performance changes</div>
                          <div><strong>Optimization Opportunities:</strong> Identified improvement areas</div>
                          <div><strong>Capacity Planning:</strong> Resource usage projections</div>
                          <div><strong>Action Items:</strong> Recommended next steps</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded mt-4">
                        <h5 className="font-medium mb-2">📊 Performance Metrics Checklist:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Execution time monitoring setup
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Resource usage tracking configured
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Success/failure rate monitoring
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Real-time dashboard created
                            </label>
                          </div>
                          <div className="space-y-1">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Performance alerts configured
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Historical trend analysis setup
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Automated reporting implemented
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Optimization recommendations automated
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Performance Metrics Mastered!</h4>
                      <p className="mb-4">
                        You've implemented comprehensive performance monitoring with metrics collection, real-time dashboards, 
                        intelligent alerting, and automated reporting. Your n8n workflows are now fully observable and optimizable!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Performance Metrics Complete</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Optimization Patterns</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-8',
              title: 'Optimization Patterns',
              description: 'Learn common optimization patterns',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Optimization Patterns &amp; Best Practices
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Learn proven optimization patterns that can dramatically improve your n8n workflow performance. 
                        These battle-tested patterns help you avoid common performance pitfalls and implement solutions 
                        that scale effectively with your data volumes and complexity requirements.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-purple-500">
                        <h4 className="font-semibold mb-2">🎯 Pattern Mastery Goals:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Master reusable optimization patterns for common scenarios</li>
                          <li>Identify and avoid performance anti-patterns</li>
                          <li>Implement data processing optimization strategies</li>
                          <li>Build workflows that scale efficiently with growth</li>
                          <li>Create maintainable high-performance architectures</li>
                        </ul>
                      </div>
                    </div>

                    {/* Pattern 1: Batch Processing */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        Pattern 1: Batch Processing Optimization
                      </h4>
                      <p className="mb-4">
                        Process large datasets efficiently by grouping operations into optimal batch sizes. 
                        This pattern reduces overhead and improves throughput for high-volume data operations.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">
                            ✅ Optimized Batch Pattern
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• Process 100-1000 items per batch</li>
                            <li>• Use parallel batch processing</li>
                            <li>• Implement batch size auto-tuning</li>
                            <li>• Add batch-level error handling</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">
                            ❌ Inefficient Anti-Pattern
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• Processing items one by one</li>
                            <li>• Using fixed small batch sizes</li>
                            <li>• No error handling per batch</li>
                            <li>• Memory accumulation across batches</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                        <h5 className="font-medium mb-2">🔧 Batch Processing Implementation:</h5>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <pre>{`// Optimized batch processing pattern
const processBatches = async (items, batchSize = 500) => {
  const results = [];
  const totalBatches = Math.ceil(items.length / batchSize);
  
  // Process batches with optimal concurrency
  const concurrency = Math.min(4, totalBatches);
  const batchPromises = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchIndex = Math.floor(i / batchSize);
    
    const batchPromise = processBatch(batch, batchIndex)
      .catch(error => {
        console.error(\`Batch \${batchIndex} failed:\`, error);
        return { error: error.message, batchIndex };
      });
    
    batchPromises.push(batchPromise);
    
    // Control concurrency - process in groups
    if (batchPromises.length >= concurrency || i + batchSize >= items.length) {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      batchPromises.length = 0; // Clear array
      
      // Memory cleanup between batch groups
      if (global.gc) global.gc();
    }
  }
  
  return results;
};`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Optimization Patterns Mastered!</h4>
                      <p className="mb-4">
                        You've learned essential optimization patterns including batch processing, smart caching, 
                        and resource pooling. These patterns form the foundation for building high-performance, 
                        scalable n8n workflows.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Patterns Complete</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Performance Testing</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-9',
              title: 'Performance Testing',
              description: 'Implement performance testing strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <Loader2 className="h-5 w-5 mr-2" />
                        Performance Testing &amp; Validation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Performance testing ensures your n8n workflows can handle real-world loads and maintain 
                        acceptable response times under various conditions. Learn to design comprehensive test 
                        strategies that validate performance before deployment and catch regressions early.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-emerald-500">
                        <h4 className="font-semibold mb-2">🎯 Performance Testing Goals:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Validate workflows meet performance requirements under normal load</li>
                          <li>Identify performance bottlenecks before they impact users</li>
                          <li>Establish performance baselines and regression detection</li>
                          <li>Test scalability limits and failure points</li>
                          <li>Automate performance validation in CI/CD pipelines</li>
                        </ul>
                      </div>
                    </div>

                    {/* Test Strategy */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        Step 1: Performance Test Strategy &amp; Planning
                      </h4>
                      <p className="mb-4">
                        Design a comprehensive testing strategy that covers different load scenarios and 
                        performance requirements for your specific workflow use cases.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                            📊 Test Types
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• <strong>Baseline Testing:</strong> Single execution performance</li>
                            <li>• <strong>Load Testing:</strong> Normal expected usage</li>
                            <li>• <strong>Stress Testing:</strong> Beyond normal capacity</li>
                            <li>• <strong>Spike Testing:</strong> Sudden load increases</li>
                            <li>• <strong>Endurance Testing:</strong> Extended duration runs</li>
                          </ul>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                            🎯 Performance Metrics
                          </h5>
                          <ul className="text-sm space-y-1">
                            <li>• <strong>Response Time:</strong> &lt;5s for normal operations</li>
                            <li>• <strong>Throughput:</strong> Workflows/minute capacity</li>
                            <li>• <strong>Error Rate:</strong> &lt;1% failure rate</li>
                            <li>• <strong>Resource Usage:</strong> CPU/Memory limits</li>
                            <li>• <strong>Concurrent Users:</strong> Max parallel executions</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded border-l-4 border-teal-500">
                        <h5 className="font-medium mb-2">📋 Performance Test Plan:</h5>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <pre>{`// Performance Test Configuration
const performanceTestPlan = {
  workflow: {
    id: 'customer-data-processing',
    name: 'Customer Data Processing Pipeline',
    expectedLoad: {
      normalUsers: 50,
      peakUsers: 200,
      dataVolume: '10K records/hour'
    }
  },
  
  testScenarios: [
    {
      name: 'Baseline Performance',
      type: 'baseline',
      duration: '5 minutes',
      users: 1,
      expectedResponseTime: '< 3 seconds',
      expectedThroughput: '20 executions/minute'
    },
    {
      name: 'Normal Load Test',
      type: 'load',
      duration: '15 minutes',
      users: 50,
      rampUpTime: '2 minutes',
      expectedResponseTime: '< 5 seconds',
      expectedThroughput: '100 executions/minute',
      acceptableErrorRate: '< 1%'
    }
  ]
};`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Performance Testing Implemented!</h4>
                      <p className="mb-4">
                        You've established comprehensive performance testing with automated execution, metrics 
                        collection, and result analysis. Your workflows now have robust performance validation!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Testing Framework Complete</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Load Testing</span>
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
          title: '🎯 Advanced',
          description: 'Advanced performance techniques',
          steps: [
            {
              id: 'performance-step-10',
              title: 'Load Testing',
              description: 'Perform comprehensive load testing',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Comprehensive Load Testing Strategy
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Load testing validates your n8n workflows can handle expected production traffic without 
                        degrading performance. Learn to design realistic load scenarios, execute comprehensive 
                        tests, and interpret results to ensure your workflows scale effectively.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded border-l-4 border-red-500">
                        <h4 className="font-semibold mb-2">🎯 Load Testing Objectives:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Determine maximum capacity and performance limits</li>
                          <li>Validate system behavior under sustained high load</li>
                          <li>Identify resource bottlenecks and scaling requirements</li>
                          <li>Test system recovery and stability under stress</li>
                          <li>Establish capacity planning baselines for growth</li>
                        </ul>
                      </div>
                    </div>

                    {/* Load Test Design */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        Step 1: Load Test Scenario Design
                      </h4>
                      <p className="mb-4">
                        Create realistic load testing scenarios that simulate actual production usage patterns 
                        and gradually increase load to identify breaking points.
                      </p>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-300">
                          📈 Load Testing Phases
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <strong>Ramp-Up:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Gradual load increase</li>
                              <li>• System warm-up period</li>
                              <li>• Initial stability check</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Steady State:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Sustained load testing</li>
                              <li>• Performance monitoring</li>
                              <li>• Stability validation</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Peak Load:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Maximum capacity test</li>
                              <li>• Stress point identification</li>
                              <li>• Failure mode analysis</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Ramp-Down:</strong>
                            <ul className="text-xs mt-1 space-y-1">
                              <li>• Graceful load reduction</li>
                              <li>• Recovery validation</li>
                              <li>• System cleanup</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border-l-4 border-blue-500">
                        <h5 className="font-medium mb-2">🔧 Load Test Implementation:</h5>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                          <pre>{`// Advanced Load Testing Framework
class LoadTestFramework {
  constructor(config) {
    this.config = config;
    this.activeUsers = 0;
    this.metrics = {
      responseTimes: [],
      throughput: [],
      errors: [],
      resources: []
    };
    this.testPhase = 'idle';
  }
  
  async executeLoadTest() {
    console.log('Starting Comprehensive Load Test...');
    
    try {
      // Phase 1: Baseline
      await this.runPhase('baseline', {
        users: 1,
        duration: 300000, // 5 minutes
        description: 'Single user baseline performance'
      });
      
      // Phase 2: Ramp-up
      await this.runPhase('rampup', {
        startUsers: 1,
        endUsers: this.config.targetLoad,
        duration: this.config.rampUpDuration,
        description: 'Gradual load increase'
      });
      
      return this.generateLoadTestReport();
      
    } catch (error) {
      console.error('Load test failed:', error);
      throw error;
    }
  }
}`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Load Testing Mastered!</h4>
                      <p className="mb-4">
                        You've implemented comprehensive load testing with realistic scenarios, gradual ramp-up, 
                        and detailed performance analysis. Your workflows are now validated for production scale!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Load Testing Complete</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">➡️ Next: Scalability Planning</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-11',
              title: 'Scalability Planning',
              description: 'Plan for workflow scalability and growth',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Scalability Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        📈 Scalability Planning &amp; Architecture
                      </h4>
                      <p className="mb-4">
                        Master the art of designing scalable n8n workflows that can handle exponential growth 
                        in data volume, user requests, and processing complexity.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">🔄 Horizontal vs Vertical Scaling</h5>
                          <div className="space-y-3 text-sm">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                              <strong>Horizontal Scaling (Scale Out):</strong>
                              <div className="mt-1">• Add more workflow instances</div>
                              <div>• Distribute load across multiple servers</div>
                              <div>• Better fault tolerance &amp; redundancy</div>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded">
                              <strong>Vertical Scaling (Scale Up):</strong>
                              <div className="mt-1">• Increase CPU/RAM per instance</div>
                              <div>• Simpler architecture management</div>
                              <div>• Hardware limitations apply</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🎯 Scaling Decision Matrix</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Data Volume:</strong> &gt;10GB/day → Horizontal</div>
                            <div><strong>Concurrent Users:</strong> &gt;100 → Horizontal</div>
                            <div><strong>Processing Complexity:</strong> CPU-intensive → Vertical</div>
                            <div><strong>Budget:</strong> Limited → Vertical first</div>
                            <div><strong>Availability:</strong> 99.9%+ → Horizontal</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🏗️ Auto-Scaling Architecture:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Scalable Workflow Manager
class ScalableWorkflowManager {
  constructor() {
    this.instances = new Map();
    this.loadBalancer = new LoadBalancer();
    this.metrics = new MetricsCollector();
    this.scaleConfig = {
      minInstances: 2,
      maxInstances: 20,
      targetCpuUtilization: 70,
      scaleUpThreshold: 80,
      scaleDownThreshold: 30,
      cooldownPeriod: 300 // 5 minutes
    };
  }
  
  async autoScale() {
    const currentMetrics = await this.metrics.getAverageMetrics();
    
    if (currentMetrics.cpuUtilization > this.scaleConfig.scaleUpThreshold) {
      await this.scaleUp();
    } else if (currentMetrics.cpuUtilization < this.scaleConfig.scaleDownThreshold) {
      await this.scaleDown();
    }
  }
  
  async scaleUp() {
    const currentCount = this.instances.size;
    if (currentCount < this.scaleConfig.maxInstances) {
      const newInstance = await this.createWorkflowInstance();
      this.instances.set(newInstance.id, newInstance);
      this.loadBalancer.addInstance(newInstance);
      
      console.log(\`Scaled up: \${currentCount + 1} instances running\`);
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Advanced Scaling Strategies */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🚀 Advanced Scaling Strategies
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated scaling patterns including queue-based scaling, 
                        microservice architecture, and predictive scaling algorithms.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📊 Predictive Scaling Algorithm:</h5>
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// AI-Powered Predictive Scaling
class PredictiveScaler {
  constructor() {
    this.historicalData = [];
    this.mlModel = new ScalingPredictor();
    this.seasonalPatterns = new Map();
  }
  
  async predictFutureLoad(timeHorizon = 3600) { // 1 hour ahead
    const features = {
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      historicalTrend: this.calculateTrend(),
      currentLoad: await this.getCurrentLoad(),
      seasonalFactor: this.getSeasonalFactor()
    };
    
    const prediction = await this.mlModel.predict(features, timeHorizon);
    
    return {
      predictedLoad: prediction.load,
      confidence: prediction.confidence,
      recommendedInstances: this.calculateOptimalInstances(prediction.load),
      scalingAction: this.determineScalingAction(prediction)
    };
  }
  
  async proactiveScale() {
    const prediction = await this.predictFutureLoad();
    
    if (prediction.confidence > 0.8) {
      const currentInstances = this.getCurrentInstanceCount();
      const targetInstances = prediction.recommendedInstances;
      
      if (targetInstances > currentInstances) {
        await this.gradualScaleUp(targetInstances - currentInstances);
      }
    }
  }
}`}
                          </pre>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🔄 Queue-Based Scaling Pattern:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Queue Metrics 📈</strong>
                              <div className="mt-1 space-y-1">
                                <div>• Queue depth: 1,247 items</div>
                                <div>• Processing rate: 85 items/min</div>
                                <div>• Wait time: avg 3.2 minutes</div>
                                <div>• Throughput: 95% optimal</div>
                              </div>
                            </div>
                            <div>
                              <strong>Scaling Triggers 🎯</strong>
                              <div className="mt-1 space-y-1">
                                <div>• Queue depth &gt; 1000 → +2 instances</div>
                                <div>• Wait time &gt; 5 min → +1 instance</div>
                                <div>• Throughput &lt; 70% → +3 instances</div>
                                <div>• Queue empty 10+ min → -1 instance</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Planning */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🎯 Capacity Planning &amp; Cost Optimization
                      </h4>
                      <p className="mb-4">
                        Balance performance requirements with cost efficiency through intelligent 
                        capacity planning and resource allocation strategies.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded text-center">
                          <div className="text-2xl font-bold text-green-600">2.5x</div>
                          <div className="text-sm">Growth Factor</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Plan for 2.5x current peak load
                          </div>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded text-center">
                          <div className="text-2xl font-bold text-blue-600">70%</div>
                          <div className="text-sm">Target Utilization</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Optimal CPU/memory usage
                          </div>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded text-center">
                          <div className="text-2xl font-bold text-purple-600">5 min</div>
                          <div className="text-sm">Scale Response</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Maximum scaling reaction time
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2">💰 Cost-Optimized Scaling Strategy:</h5>
                        <div className="text-sm space-y-2">
                          <div><strong>Off-Peak Hours (10 PM - 6 AM):</strong> Scale down to 30% capacity</div>
                          <div><strong>Business Hours (9 AM - 5 PM):</strong> Maintain 100% capacity</div>
                          <div><strong>Peak Periods (5 PM - 9 PM):</strong> Auto-scale up to 150%</div>
                          <div><strong>Weekend Mode:</strong> Reduced to 50% with faster scaling triggers</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🏆 Scalability Master!</h4>
                      <p className="mb-4">
                        You've mastered advanced scalability planning with predictive algorithms, queue-based scaling, 
                        and cost optimization strategies. Ready for the final challenge - performance troubleshooting!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Scalability Planning</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Troubleshooting</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-12',
              title: 'Performance Troubleshooting',
              description: 'Advanced troubleshooting techniques',
              estimated_time: '50 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Advanced Diagnostics */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🔧 Advanced Performance Diagnostics
                      </h4>
                      <p className="mb-4">
                        Master systematic performance troubleshooting with advanced diagnostic tools, 
                        root cause analysis, and comprehensive resolution strategies.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">🚨 Performance Symptoms</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                              <span>Response time degradation (&gt;5s)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                              <span>Memory usage spikes (&gt;80%)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                              <span>Error rate increase (&gt;2%)</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                              <span>Queue backlog growth</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">🔍 Diagnostic Approach</h5>
                          <div className="space-y-2 text-sm">
                            <div>1. <strong>Symptom Collection:</strong> Gather performance metrics</div>
                            <div>2. <strong>Baseline Comparison:</strong> Compare to historical data</div>
                            <div>3. <strong>Pattern Analysis:</strong> Identify recurring issues</div>
                            <div>4. <strong>Root Cause:</strong> Drill down to actual cause</div>
                            <div>5. <strong>Solution Implementation:</strong> Apply targeted fixes</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🤖 AI-Powered Diagnostic Engine:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Performance Diagnostic System
class PerformanceDiagnosticEngine {
  constructor() {
    this.symptomAnalyzer = new SymptomAnalyzer();
    this.rootCauseEngine = new RootCauseAnalysisEngine();
    this.solutionDatabase = new SolutionDatabase();
    this.mlPredictor = new PerformancePredictor();
  }
  
  async diagnosePerformanceIssue(symptoms) {
    // Phase 1: Symptom Analysis
    const analysisResults = await this.symptomAnalyzer.analyze(symptoms);
    
    // Phase 2: Pattern Recognition  
    const patterns = await this.identifyPatterns(analysisResults);
    
    // Phase 3: Root Cause Analysis
    const rootCauses = await this.rootCauseEngine.investigate({
      symptoms: analysisResults,
      patterns: patterns,
      systemState: await this.getSystemState()
    });
    
    // Phase 4: Solution Recommendation
    const solutions = await this.recommendSolutions(rootCauses);
    
    return {
      severity: this.calculateSeverity(symptoms),
      rootCauses: rootCauses,
      recommendedActions: solutions,
      estimatedResolutionTime: this.estimateResolutionTime(solutions),
      preventiveMeasures: await this.suggestPrevention(rootCauses)
    };
  }
  
  async analyzeSymptoms(symptoms) {
    const findings = [];
    
    // Analyze response time degradation
    if (symptoms.responseTimeIncrease) {
      findings.push({
        type: 'response_time_analysis',
        severity: this.calculateSeverity(symptoms.responseTimeIncrease),
        details: {
          baseline: symptoms.baseline,
          current: symptoms.current,
          increase: symptoms.responseTimeIncrease,
          possibleCauses: [
            'Database query slowdown',
            'Network latency increase',
            'Memory pressure',
            'CPU bottleneck',
            'Resource contention'
          ]
        }
      });
    }
    
    // Analyze error rate spikes
    if (symptoms.errorRateIncrease) {
      findings.push({
        type: 'error_rate_analysis',
        severity: 'high',
        details: {
          errorTypes: await this.categorizeErrors(symptoms.errors),
          patterns: await this.identifyErrorPatterns(symptoms.errors),
          affectedWorkflows: symptoms.affectedWorkflows
        }
      });
    }
    
    return findings;
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Common Issues Resolution */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🛠️ Common Performance Issues &amp; Solutions
                      </h4>
                      <p className="mb-4">
                        Learn to quickly identify and resolve the most common performance issues that affect 
                        n8n workflows, with proven solutions and prevention strategies.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-yellow-700 dark:text-yellow-300">
                            ⚠️ Top Performance Issues &amp; Quick Fixes
                          </h5>
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-red-500">
                              <strong>Memory Leaks:</strong> Gradual memory increase over time
                              <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                → Check for unclosed connections, large data accumulation, event listener leaks
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-orange-500">
                              <strong>Database Bottlenecks:</strong> Slow query execution times
                              <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                → Optimize queries, add indexes, implement connection pooling
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-blue-500">
                              <strong>API Rate Limiting:</strong> External service throttling
                              <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                → Implement retry logic, request queuing, caching strategies
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">✅ Troubleshooting Checklist:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Check system resource utilization
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Analyze workflow execution logs
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Review recent configuration changes
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Validate data volume patterns
                              </label>
                            </div>
                            <div className="space-y-1">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Test individual node performance
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Check external service status
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Verify network connectivity
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Compare with performance baselines
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Performance Troubleshooting Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced performance troubleshooting with systematic diagnostics, root cause 
                        analysis, and comprehensive resolution strategies. You're now equipped to handle any performance challenge!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Troubleshooting Expert</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🏆 Performance Optimization Complete</span>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Error Detection Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔍 Error Detection &amp; Categorization Fundamentals
                      </h4>
                      <p className="mb-4">
                        Master the foundation of robust workflow error handling by learning to systematically identify, 
                        categorize, and track different types of errors in your n8n workflows.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🚨 Error Types &amp; Severity</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                              <span><strong>Critical:</strong> Workflow stops completely</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                              <span><strong>Warning:</strong> Partial failure, continues execution</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                              <span><strong>Info:</strong> Recoverable errors with retry logic</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                              <span><strong>Debug:</strong> Non-critical informational messages</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">📊 Detection Methods</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Real-time Monitoring:</strong> Live error dashboards</div>
                            <div><strong>Log Analysis:</strong> Automated error log scanning</div>
                            <div><strong>Health Checks:</strong> Periodic workflow validation</div>
                            <div><strong>Custom Sensors:</strong> Error tracking nodes</div>
                            <div><strong>External Alerts:</strong> Third-party monitoring tools</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🏗️ Error Classification Framework:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Error Classification System
class ErrorClassificationFramework {
  constructor() {
    this.errorCategories = this.initializeCategories();
    this.severityLevels = this.initializeSeverityLevels();
    this.detectionRules = this.initializeDetectionRules();
  }
  
  // Initialize error categories with detailed classification
  initializeCategories() {
    return {
      // System Level Errors - Infrastructure & Environment
      SYSTEM: {
        MEMORY: {
          types: ['OutOfMemoryError', 'MemoryLeak', 'HeapOverflow'],
          description: 'Memory-related system failures',
          commonCauses: ['Large data processing', 'Memory leaks', 'Insufficient RAM']
        },
        CPU: {
          types: ['TimeoutError', 'HighCpuUsage', 'ProcessorBottleneck'],
          description: 'CPU and processing-related issues',
          commonCauses: ['Complex calculations', 'Infinite loops', 'Resource contention']
        },
        NETWORK: {
          types: ['ConnectionRefused', 'NetworkTimeout', 'DNSResolutionError'],
          description: 'Network connectivity and communication failures',
          commonCauses: ['Internet connectivity', 'Firewall blocking', 'DNS issues']
        },
        DISK: {
          types: ['NoSpaceLeft', 'PermissionDenied', 'FileNotFound'],
          description: 'Storage and file system related errors',
          commonCauses: ['Disk full', 'Permission issues', 'File corruption']
        }
      },
      
      // Application Level Errors - n8n Specific
      APPLICATION: {
        VALIDATION: {
          types: ['InvalidInputData', 'SchemaValidationError', 'TypeMismatch'],
          description: 'Data validation and format errors',
          commonCauses: ['Malformed input', 'Schema changes', 'Type conversion']
        },
        LOGIC: {
          types: ['BusinessRuleViolation', 'ConditionalError', 'FlowLogicError'],
          description: 'Workflow logic and business rule violations',
          commonCauses: ['Invalid conditions', 'Rule changes', 'Logic conflicts']
        },
        INTEGRATION: {
          types: ['APIFailure', 'ServiceUnavailable', 'RateLimitExceeded'],
          description: 'External service integration failures',
          commonCauses: ['API downtime', 'Rate limits', 'Service changes']
        },
        AUTHENTICATION: {
          types: ['TokenExpired', 'InvalidCredentials', 'PermissionDenied'],
          description: 'Authentication and authorization errors',
          commonCauses: ['Expired tokens', 'Wrong credentials', 'Permission changes']
        }
      },
      
      // Data Level Errors - Data Processing Issues
      DATA: {
        FORMAT: {
          types: ['JSONParseError', 'XMLParseError', 'CSVFormatError'],
          description: 'Data format and parsing errors',
          commonCauses: ['Malformed data', 'Encoding issues', 'Format changes']
        },
        MISSING: {
          types: ['RequiredFieldMissing', 'NullPointerException', 'UndefinedValue'],
          description: 'Missing or undefined data elements',
          commonCauses: ['Incomplete data', 'Schema changes', 'Source issues']
        },
        CONSTRAINT: {
          types: ['UniqueConstraintViolation', 'ForeignKeyError', 'CheckConstraintError'],
          description: 'Database constraint violations',
          commonCauses: ['Duplicate entries', 'Referential integrity', 'Data rules']
        },
        TRANSFORMATION: {
          types: ['MappingError', 'ConversionError', 'FilterError'],
          description: 'Data transformation and mapping failures',
          commonCauses: ['Mapping changes', 'Type mismatches', 'Logic errors']
        }
      }
    };
  }
  
  // Classify incoming error with comprehensive analysis
  async classifyError(error, context = {}) {
    const classification = {
      category: this.determineCategory(error),
      severity: this.calculateSeverity(error, context),
      type: this.identifyType(error),
      source: this.identifySource(error, context),
      timestamp: new Date().toISOString(),
      context: context,
      suggestedActions: this.generateActionPlan(error),
      relatedErrors: await this.findRelatedErrors(error)
    };
    
    return classification;
  }
  
  // Advanced pattern matching for error categorization
  determineCategory(error) {
    const errorMessage = error.message.toLowerCase();
    
    // System level detection patterns
    if (this.matchesPattern(errorMessage, ['memory', 'heap', 'ram'])) {
      return { level: 'SYSTEM', type: 'MEMORY' };
    }
    if (this.matchesPattern(errorMessage, ['timeout', 'cpu', 'processing'])) {
      return { level: 'SYSTEM', type: 'CPU' };
    }
    if (this.matchesPattern(errorMessage, ['connection', 'network', 'dns'])) {
      return { level: 'SYSTEM', type: 'NETWORK' };
    }
    
    // Application level detection patterns
    if (this.matchesPattern(errorMessage, ['validation', 'invalid', 'schema'])) {
      return { level: 'APPLICATION', type: 'VALIDATION' };
    }
    if (this.matchesPattern(errorMessage, ['api', 'service', 'endpoint'])) {
      return { level: 'APPLICATION', type: 'INTEGRATION' };
    }
    if (this.matchesPattern(errorMessage, ['auth', 'token', 'permission'])) {
      return { level: 'APPLICATION', type: 'AUTHENTICATION' };
    }
    
    // Data level detection patterns
    if (this.matchesPattern(errorMessage, ['json', 'xml', 'parse'])) {
      return { level: 'DATA', type: 'FORMAT' };
    }
    if (this.matchesPattern(errorMessage, ['missing', 'null', 'undefined'])) {
      return { level: 'DATA', type: 'MISSING' };
    }
    
    return { level: 'UNKNOWN', type: 'UNCLASSIFIED' };
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Smart Error Detection Implementation */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🤖 Smart Error Detection Implementation
                      </h4>
                      <p className="mb-4">
                        Implement intelligent error detection systems that automatically identify, categorize, 
                        and respond to errors with machine learning-powered pattern recognition.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🔮 AI-Powered Error Detection Node:</h5>
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Intelligent Error Detection & Auto-Response System
class SmartErrorDetector {
  constructor() {
    this.patterns = new Map();
    this.mlModel = new ErrorPredictionModel();
    this.thresholds = {
      errorRate: 0.02,           // 2% error rate threshold
      responseTime: 5000,        // 5 second response threshold
      consecutiveFailures: 3,    // 3 consecutive failures trigger
      memoryUsage: 0.85         // 85% memory usage warning
    };
    this.alertChannels = new AlertManager();
  }
  
  // Real-time workflow execution monitoring
  async monitorWorkflowExecution(execution) {
    const detectionResults = [];
    
    try {
      // 1. Performance-based Error Detection
      if (execution.duration > this.thresholds.responseTime) {
        detectionResults.push({
          type: 'PERFORMANCE_DEGRADATION',
          severity: 'WARNING',
          message: \`Execution exceeded response threshold: \${execution.duration}ms\`,
          suggestions: [
            'Check for database query optimization opportunities',
            'Review external API response times',
            'Consider implementing caching strategies',
            'Analyze memory usage patterns'
          ],
          autoActions: ['enable_debug_logging', 'scale_resources']
        });
      }
      
      // 2. Error Pattern Recognition
      const errorPatterns = await this.analyzeErrorPatterns(execution.errors);
      if (errorPatterns.confidence > 0.75) {
        detectionResults.push({
          type: 'ERROR_PATTERN_DETECTED',
          severity: errorPatterns.severity,
          pattern: errorPatterns.type,
          occurrences: errorPatterns.count,
          timeframe: errorPatterns.timespan,
          predictedImpact: errorPatterns.impact,
          recommendations: errorPatterns.solutions,
          autoActions: ['implement_circuit_breaker', 'enable_retry_logic']
        });
      }
      
      // 3. Resource Usage Analysis
      const resourceAnalysis = await this.analyzeResourceUsage(execution.stats);
      detectionResults.push(...resourceAnalysis);
      
      // 4. Business Logic Validation
      const logicValidation = await this.validateBusinessLogic(execution);
      detectionResults.push(...logicValidation);
      
      // 5. External Dependencies Health Check
      const dependencyCheck = await this.checkExternalDependencies(execution);
      detectionResults.push(...dependencyCheck);
      
      return this.prioritizeAndRespond(detectionResults);
      
    } catch (detectorError) {
      // Self-monitoring: detect errors in the error detector itself
      console.error('Error in SmartErrorDetector:', detectorError);
      return [{
        type: 'DETECTOR_FAILURE',
        severity: 'CRITICAL',
        message: 'Error detection system failure',
        fallbackAction: 'enable_basic_monitoring'
      }];
    }
  }
  
  // Advanced error pattern analysis with machine learning
  async analyzeErrorPatterns(errors) {
    if (!errors || errors.length === 0) {
      return { confidence: 0 };
    }
    
    // Extract features from error data
    const features = this.extractErrorFeatures(errors);
    
    // Use ML model to predict pattern type and severity
    const prediction = await this.mlModel.predict(features);
    
    // Historical pattern matching
    const historicalMatch = this.findHistoricalPattern(errors);
    
    return {
      confidence: prediction.confidence,
      type: prediction.patternType,
      severity: prediction.severity,
      count: errors.length,
      timespan: this.calculateTimespan(errors),
      impact: prediction.estimatedImpact,
      solutions: this.generateSolutions(prediction.patternType),
      historical: historicalMatch
    };
  }
  
  // Generate contextual solutions based on error type
  generateSolutions(patternType) {
    const solutionMap = {
      'API_TIMEOUT_PATTERN': [
        'Implement exponential backoff retry strategy',
        'Add request timeout configuration',
        'Enable connection pooling',
        'Set up health check endpoints'
      ],
      'DATA_VALIDATION_PATTERN': [
        'Add input validation schemas',
        'Implement data sanitization',
        'Create validation checkpoints',
        'Enable data type conversion'
      ],
      'AUTHENTICATION_PATTERN': [
        'Implement token refresh logic',
        'Add credential rotation',
        'Enable OAuth 2.0 flow',
        'Set up service account authentication'
      ],
      'MEMORY_LEAK_PATTERN': [
        'Add memory monitoring alerts',
        'Implement garbage collection optimization',
        'Review large data processing logic',
        'Enable memory profiling'
      ]
    };
    
    return solutionMap[patternType] || ['Enable detailed logging for analysis'];
  }
}`}
                          </pre>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📊 Real-Time Error Dashboard Integration:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Live Metrics 📈</strong>
                              <div className="mt-1 space-y-1">
                                <div>• Error rate: 1.2% (▼ 0.3% from yesterday)</div>
                                <div>• Response time: 2.1s avg (▲ 0.4s)</div>
                                <div>• Success rate: 98.8% (▲ 0.2%)</div>
                                <div>• Active workflows: 247 (▲ 12)</div>
                              </div>
                            </div>
                            <div>
                              <strong>Alert Status 🚨</strong>
                              <div className="mt-1 space-y-1">
                                <div>• Critical: 0 active alerts</div>
                                <div>• Warning: 3 pending issues</div>
                                <div>• Info: 15 recent notifications</div>
                                <div>• Resolved: 42 in last 24h</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Practical Implementation Guide */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🛠️ Step-by-Step Implementation Guide
                      </h4>
                      <p className="mb-4">
                        Follow this practical guide to implement comprehensive error detection in your 
                        n8n workflows, from basic monitoring to advanced AI-powered pattern recognition.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">✅ Implementation Checklist:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Set up basic error logging</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Configure error classification rules</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Implement severity levels</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Create error monitoring dashboard</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Set up alert notifications</span>
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Add pattern recognition logic</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Configure automatic responses</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Implement error metrics tracking</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Test error detection scenarios</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Document error handling procedures</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Quick Start Template:</h5>
                          <div className="text-sm">
                            <div className="mb-2"><strong>1. Basic Error Node Setup:</strong></div>
                            <div className="ml-4 space-y-1">
                              <div>• Add "Error Trigger" node to catch workflow errors</div>
                              <div>• Configure "HTTP Request" error handling</div>
                              <div>• Set up "Set" node for error data formatting</div>
                            </div>
                            <div className="mb-2 mt-3"><strong>2. Error Classification:</strong></div>
                            <div className="ml-4 space-y-1">
                              <div>• Use "Switch" node for error type routing</div>
                              <div>• Add "Function" node for custom classification logic</div>
                              <div>• Configure severity level assignment</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Error Detection Mastered!</h4>
                      <p className="mb-4">
                        You've successfully learned to implement comprehensive error detection with intelligent 
                        classification, pattern recognition, and automated responses. Ready to dive into error classification strategies!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Error Detection</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Classification</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'error-step-2',
              title: 'Error Classification',
              description: 'Categorize errors by type and severity',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Error Classification Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🏷️ Error Classification &amp; Severity Management
                      </h4>
                      <p className="mb-4">
                        Build upon error detection by implementing systematic classification strategies that 
                        automatically categorize errors by type, severity, and impact to enable targeted responses.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-300">🎯 Classification Dimensions</h5>
                          <div className="space-y-3 text-sm">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                              <strong>Severity Level:</strong> Critical → Warning → Info → Debug
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                              <strong>Error Source:</strong> System → Application → Data → External
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                              <strong>Recovery Type:</strong> Auto → Manual → Escalation → Ignore
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                              <strong>Business Impact:</strong> High → Medium → Low → None
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🔍 Classification Criteria</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Frequency:</strong> How often the error occurs</div>
                            <div><strong>Impact Scope:</strong> How many users/workflows affected</div>
                            <div><strong>Data Integrity:</strong> Risk to data corruption</div>
                            <div><strong>Recovery Time:</strong> Time needed to resolve</div>
                            <div><strong>Automation Level:</strong> Can be auto-resolved</div>
                            <div><strong>Escalation Path:</strong> Who needs to be notified</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">⚙️ Smart Classification Engine:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Error Classification & Auto-Response System
class SmartErrorClassifier {
  constructor() {
    this.classificationRules = this.initializeClassificationRules();
    this.severityMatrix = this.initializeSeverityMatrix();
    this.responseTemplates = this.initializeResponseTemplates();
    this.mlClassifier = new MachineLearningClassifier();
  }
  
  // Initialize comprehensive classification rules
  initializeClassificationRules() {
    return {
      // System-Level Error Classification
      SYSTEM_ERRORS: {
        MEMORY: {
          patterns: [/memory|heap|ram|oom/i],
          severityFactors: {
            'OutOfMemoryError': 'CRITICAL',
            'MemoryWarning': 'WARNING', 
            'MemoryLeak': 'HIGH'
          },
          autoRecovery: false,
          escalationRequired: true,
          businessImpact: 'HIGH'
        },
        NETWORK: {
          patterns: [/connection|network|timeout|dns/i],
          severityFactors: {
            'ConnectionRefused': 'HIGH',
            'NetworkTimeout': 'MEDIUM',
            'DNSResolution': 'MEDIUM'
          },
          autoRecovery: true,
          maxRetries: 3,
          businessImpact: 'MEDIUM'
        },
        DISK: {
          patterns: [/disk|storage|space|file/i],
          severityFactors: {
            'NoSpaceLeft': 'CRITICAL',
            'PermissionDenied': 'HIGH',
            'FileNotFound': 'MEDIUM'
          },
          autoRecovery: false,
          escalationRequired: true,
          businessImpact: 'HIGH'
        }
      },
      
      // Application-Level Error Classification
      APPLICATION_ERRORS: {
        VALIDATION: {
          patterns: [/validation|invalid|schema|format/i],
          severityFactors: {
            'SchemaValidation': 'MEDIUM',
            'DataFormat': 'MEDIUM',
            'TypeMismatch': 'LOW'
          },
          autoRecovery: true,
          retryWithTransformation: true,
          businessImpact: 'LOW'
        },
        INTEGRATION: {
          patterns: [/api|service|endpoint|integration/i],
          severityFactors: {
            'APIFailure': 'HIGH',
            'ServiceUnavailable': 'HIGH',
            'RateLimitExceeded': 'MEDIUM'
          },
          autoRecovery: true,
          backoffStrategy: 'exponential',
          businessImpact: 'MEDIUM'
        },
        AUTHENTICATION: {
          patterns: [/auth|token|credential|permission/i],
          severityFactors: {
            'TokenExpired': 'MEDIUM',
            'InvalidCredentials': 'HIGH',
            'PermissionDenied': 'HIGH'
          },
          autoRecovery: true,
          refreshStrategy: 'token_refresh',
          businessImpact: 'HIGH'
        }
      },
      
      // Data-Level Error Classification
      DATA_ERRORS: {
        FORMAT: {
          patterns: [/json|xml|csv|parse|format/i],
          severityFactors: {
            'JSONParseError': 'MEDIUM',
            'XMLParseError': 'MEDIUM',
            'CSVFormatError': 'LOW'
          },
          autoRecovery: true,
          fallbackParsing: true,
          businessImpact: 'MEDIUM'
        },
        INTEGRITY: {
          patterns: [/constraint|duplicate|foreign.*key|integrity/i],
          severityFactors: {
            'UniqueConstraint': 'HIGH',
            'ForeignKeyViolation': 'HIGH',
            'CheckConstraint': 'MEDIUM'
          },
          autoRecovery: false,
          dataValidationRequired: true,
          businessImpact: 'HIGH'
        }
      }
    };
  }
  
  // Comprehensive error classification with ML enhancement
  async classifyError(error, context = {}) {
    try {
      // Step 1: Rule-based classification
      const ruleBasedClassification = this.applyClassificationRules(error);
      
      // Step 2: ML-enhanced classification
      const mlEnhancedClassification = await this.mlClassifier.enhance(
        ruleBasedClassification, 
        error, 
        context
      );
      
      // Step 3: Context-aware severity adjustment
      const contextAdjustedSeverity = this.adjustSeverityByContext(
        mlEnhancedClassification,
        context
      );
      
      // Step 4: Generate comprehensive classification result
      const finalClassification = {
        // Core Classification
        category: contextAdjustedSeverity.category,
        subcategory: contextAdjustedSeverity.subcategory,
        severity: contextAdjustedSeverity.severity,
        
        // Impact Assessment
        businessImpact: this.assessBusinessImpact(error, context),
        technicalImpact: this.assessTechnicalImpact(error, context),
        userImpact: this.assessUserImpact(error, context),
        
        // Recovery Strategy
        autoRecoverable: contextAdjustedSeverity.autoRecoverable,
        recoveryStrategy: this.determineRecoveryStrategy(contextAdjustedSeverity),
        estimatedRecoveryTime: this.estimateRecoveryTime(contextAdjustedSeverity),
        
        // Response Planning
        escalationRequired: contextAdjustedSeverity.escalationRequired,
        escalationLevel: this.determineEscalationLevel(contextAdjustedSeverity),
        notificationChannels: this.determineNotificationChannels(contextAdjustedSeverity),
        
        // Metadata
        timestamp: new Date().toISOString(),
        confidence: mlEnhancedClassification.confidence,
        historicalContext: await this.getHistoricalContext(error),
        relatedIncidents: await this.findRelatedIncidents(error)
      };
      
      // Step 5: Log classification for future ML training
      await this.logClassificationForTraining(error, finalClassification, context);
      
      return finalClassification;
      
    } catch (classificationError) {
      console.error('Error in classification process:', classificationError);
      return this.createFallbackClassification(error);
    }
  }
  
  // Apply rule-based classification logic
  applyClassificationRules(error) {
    const errorMessage = error.message.toLowerCase();
    const errorStack = error.stack ? error.stack.toLowerCase() : '';
    
    // Check each category and subcategory
    for (const [category, subcategories] of Object.entries(this.classificationRules)) {
      for (const [subcategory, rules] of Object.entries(subcategories)) {
        // Check if error matches patterns
        const patternMatch = rules.patterns.some(pattern => 
          pattern.test(errorMessage) || pattern.test(errorStack)
        );
        
        if (patternMatch) {
          // Determine specific severity based on error type
          const severity = this.determineSeverityFromRules(error, rules);
          
          return {
            category: category.replace('_ERRORS', ''),
            subcategory: subcategory,
            severity: severity,
            autoRecoverable: rules.autoRecovery,
            escalationRequired: rules.escalationRequired,
            businessImpact: rules.businessImpact,
            rules: rules
          };
        }
      }
    }
    
    // Default classification for unmatched errors
    return {
      category: 'UNKNOWN',
      subcategory: 'UNCLASSIFIED',
      severity: 'MEDIUM',
      autoRecoverable: false,
      escalationRequired: true,
      businessImpact: 'MEDIUM'
    };
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Classification Matrix Implementation */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📊 Multi-Dimensional Classification Matrix
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated classification matrices that consider multiple factors including 
                        business impact, technical severity, user experience, and recovery complexity.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Dynamic Severity Assessment:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 text-sm">
                              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                                <strong>CRITICAL (Level 1):</strong>
                                <div className="text-xs mt-1">• System down/data loss</div>
                                <div className="text-xs">• &gt;50% users affected</div>
                                <div className="text-xs">• &gt;$10k business impact</div>
                              </div>
                              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                                <strong>HIGH (Level 2):</strong>
                                <div className="text-xs mt-1">• Major features broken</div>
                                <div className="text-xs">• 10-50% users affected</div>
                                <div className="text-xs">• $1k-$10k business impact</div>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                                <strong>MEDIUM (Level 3):</strong>
                                <div className="text-xs mt-1">• Performance degradation</div>
                                <div className="text-xs">• &lt;10% users affected</div>
                                <div className="text-xs">• $100-$1k business impact</div>
                              </div>
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                                <strong>LOW (Level 4):</strong>
                                <div className="text-xs mt-1">• Minor UI issues</div>
                                <div className="text-xs">• Individual user affected</div>
                                <div className="text-xs">• &lt;$100 business impact</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🔄 Classification Decision Tree:</h5>
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Smart Classification Decision Tree
class ClassificationDecisionTree {
  
  // Multi-factor severity calculation
  calculateSeverity(error, context) {
    const factors = {
      // Technical Impact (0-100)
      technicalImpact: this.assessTechnicalImpact(error),
      
      // Business Impact (0-100) 
      businessImpact: this.assessBusinessImpact(context),
      
      // User Impact (0-100)
      userImpact: this.assessUserImpact(context),
      
      // Recovery Complexity (0-100)
      recoveryComplexity: this.assessRecoveryComplexity(error),
      
      // Frequency Factor (0-100)
      frequencyFactor: this.assessFrequency(error, context)
    };
    
    // Weighted severity calculation
    const weights = {
      technicalImpact: 0.25,
      businessImpact: 0.30,
      userImpact: 0.25,
      recoveryComplexity: 0.15,
      frequencyFactor: 0.05
    };
    
    const weightedScore = Object.entries(factors).reduce((total, [factor, score]) => {
      return total + (score * weights[factor]);
    }, 0);
    
    // Convert to severity level
    if (weightedScore >= 80) return 'CRITICAL';
    if (weightedScore >= 60) return 'HIGH';
    if (weightedScore >= 40) return 'MEDIUM';
    if (weightedScore >= 20) return 'LOW';
    return 'MINIMAL';
  }
  
  // Assess technical impact of error
  assessTechnicalImpact(error) {
    const impactFactors = {
      'OutOfMemoryError': 95,
      'DatabaseConnectionError': 90,
      'SecurityBreach': 100,
      'DataCorruption': 95,
      'SystemCrash': 100,
      'NetworkFailure': 70,
      'APITimeout': 40,
      'ValidationError': 20,
      'UIGlitch': 10
    };
    
    return impactFactors[error.type] || 50; // Default medium impact
  }
  
  // Assess business impact based on context
  assessBusinessImpact(context) {
    let impact = 0;
    
    // Revenue impact
    if (context.revenueImpact) {
      if (context.revenueImpact > 10000) impact += 40;
      else if (context.revenueImpact > 1000) impact += 30;
      else if (context.revenueImpact > 100) impact += 20;
      else impact += 10;
    }
    
    // Customer impact
    if (context.customersAffected) {
      if (context.customersAffected > 1000) impact += 30;
      else if (context.customersAffected > 100) impact += 20;
      else if (context.customersAffected > 10) impact += 15;
      else impact += 5;
    }
    
    // SLA impact
    if (context.slaViolation) {
      impact += context.slaViolation === 'critical' ? 30 : 20;
    }
    
    return Math.min(impact, 100);
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Auto-Classification Implementation */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🤖 Automated Classification Workflow
                      </h4>
                      <p className="mb-4">
                        Set up automated classification workflows that instantly categorize errors as they occur, 
                        route them to appropriate response teams, and trigger recovery actions.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">⚡ Real-Time Classification Pipeline:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="bg-blue-500 text-white p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">1</div>
                              <strong>Error Capture</strong>
                              <div className="text-xs mt-1">Automatic error detection &amp; data collection</div>
                            </div>
                            <div className="text-center">
                              <div className="bg-purple-500 text-white p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">2</div>
                              <strong>Classification</strong>
                              <div className="text-xs mt-1">Multi-dimensional analysis &amp; categorization</div>
                            </div>
                            <div className="text-center">
                              <div className="bg-green-500 text-white p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">3</div>
                              <strong>Response</strong>
                              <div className="text-xs mt-1">Automated routing &amp; recovery initiation</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Classification Implementation Checklist:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Define classification rules matrix</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Set up severity calculation logic</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Configure business impact assessment</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Implement auto-routing workflows</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Create classification dashboards</span>
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Test classification accuracy</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Set up ML model training</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Configure escalation paths</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Implement feedback loops</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Document classification procedures</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📊 Classification Metrics Dashboard:</h5>
                          <div className="grid grid-cols-4 gap-3 text-center text-sm">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded">
                              <div className="text-lg font-bold text-red-600">23</div>
                              <div>Critical</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded">
                              <div className="text-lg font-bold text-orange-600">147</div>
                              <div>High</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded">
                              <div className="text-lg font-bold text-yellow-600">589</div>
                              <div>Medium</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded">
                              <div className="text-lg font-bold text-green-600">1,247</div>
                              <div>Low</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Classification Mastery Achieved!</h4>
                      <p className="mb-4">
                        You've mastered intelligent error classification with multi-dimensional analysis, automated 
                        severity assessment, and smart routing capabilities. Ready to implement try-catch strategies!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Error Classification</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Try-Catch</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'error-step-3',
              title: 'Try-Catch Implementation',
              description: 'Add try-catch blocks to critical operations',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Try-Catch Implementation Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🛡️ Try-Catch Implementation &amp; Error Handling
                      </h4>
                      <p className="mb-4">
                        Implement robust try-catch error handling strategies in your n8n workflows to gracefully 
                        handle exceptions, prevent workflow failures, and maintain data integrity.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">🎯 Try-Catch Benefits</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              <span>Prevents complete workflow failure</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              <span>Enables graceful error recovery</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              <span>Maintains data consistency</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              <span>Provides detailed error information</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🔧 Implementation Strategy</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Critical Operations:</strong> API calls, database operations</div>
                            <div><strong>Data Transformations:</strong> JSON parsing, data mapping</div>
                            <div><strong>External Integrations:</strong> Third-party service calls</div>
                            <div><strong>File Operations:</strong> File reading, writing, processing</div>
                            <div><strong>Authentication:</strong> Token validation, credential checks</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">⚙️ Advanced Try-Catch Framework:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Try-Catch Error Handling Framework
class AdvancedTryCatchHandler {
  constructor() {
    this.errorStrategies = this.initializeErrorStrategies();
    this.recoveryMechanisms = this.initializeRecoveryMechanisms();
    this.loggingSystem = new ErrorLoggingSystem();
    this.notificationManager = new NotificationManager();
  }
  
  // Centralized try-catch wrapper with intelligent error handling
  async executeWithErrorHandling(operation, context = {}) {
    const operationId = this.generateOperationId();
    const startTime = Date.now();
    
    try {
      // Pre-execution validation
      await this.validatePreconditions(operation, context);
      
      // Log operation start
      this.loggingSystem.logOperationStart(operationId, operation.name, context);
      
      // Execute the main operation with timeout protection
      const result = await this.executeWithTimeout(operation, context);
      
      // Post-execution validation
      await this.validateResult(result, operation, context);
      
      // Log successful completion
      this.loggingSystem.logOperationSuccess(operationId, result, Date.now() - startTime);
      
      return {
        success: true,
        data: result,
        operationId: operationId,
        executionTime: Date.now() - startTime
      };
      
    } catch (error) {
      // Enhanced error handling with context-aware recovery
      return await this.handleError(error, operation, context, operationId, startTime);
    }
  }
  
  // Intelligent error handling with automatic recovery strategies
  async handleError(error, operation, context, operationId, startTime) {
    try {
      // Step 1: Classify and enrich error information
      const enrichedError = await this.enrichErrorInformation(error, operation, context);
      
      // Step 2: Determine recovery strategy based on error type
      const recoveryStrategy = this.determineRecoveryStrategy(enrichedError, operation);
      
      // Step 3: Attempt automatic recovery if applicable
      if (recoveryStrategy.autoRecoverable) {
        const recoveryResult = await this.attemptRecovery(
          enrichedError, 
          operation, 
          context, 
          recoveryStrategy
        );
        
        if (recoveryResult.success) {
          this.loggingSystem.logRecoverySuccess(operationId, enrichedError, recoveryResult);
          return {
            success: true,
            data: recoveryResult.data,
            recovered: true,
            originalError: enrichedError,
            recoveryMethod: recoveryStrategy.method,
            operationId: operationId,
            executionTime: Date.now() - startTime
          };
        }
      }
      
      // Step 4: Handle non-recoverable errors with proper logging and notifications
      await this.handleNonRecoverableError(enrichedError, operation, context, operationId);
      
      return {
        success: false,
        error: enrichedError,
        operationId: operationId,
        executionTime: Date.now() - startTime,
        recoveryAttempted: recoveryStrategy.autoRecoverable,
        escalated: recoveryStrategy.requiresEscalation
      };
      
    } catch (handlerError) {
      // Fallback error handling - never let the error handler itself fail
      console.error('Critical: Error in error handler:', handlerError);
      return this.createFallbackErrorResponse(error, operationId, startTime);
    }
  }
  
  // Enrich error with additional context and classification
  async enrichErrorInformation(error, operation, context) {
    return {
      // Original error information
      original: error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      
      // Enhanced error context
      timestamp: new Date().toISOString(),
      operationName: operation.name,
      operationType: operation.type,
      workflowId: context.workflowId,
      nodeId: context.nodeId,
      executionId: context.executionId,
      
      // Classification
      category: this.classifyError(error),
      severity: this.calculateErrorSeverity(error, operation, context),
      recoverability: this.assessRecoverability(error, operation),
      
      // Impact assessment
      businessImpact: this.assessBusinessImpact(error, context),
      technicalImpact: this.assessTechnicalImpact(error, operation),
      dataIntegrity: this.assessDataIntegrityRisk(error, context),
      
      // Environment information
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      
      // User context
      userId: context.userId,
      sessionId: context.sessionId,
      userAgent: context.userAgent
    };
  }
  
  // Advanced recovery attempt with multiple strategies
  async attemptRecovery(enrichedError, operation, context, recoveryStrategy) {
    const recoveryMethods = {
      // Retry with exponential backoff
      RETRY_WITH_BACKOFF: async () => {
        return await this.retryWithExponentialBackoff(operation, context, {
          maxRetries: recoveryStrategy.maxRetries || 3,
          baseDelay: recoveryStrategy.baseDelay || 1000,
          maxDelay: recoveryStrategy.maxDelay || 30000
        });
      },
      
      // Retry with alternative configuration
      RETRY_WITH_ALTERNATIVE: async () => {
        const alternativeContext = this.generateAlternativeContext(context, enrichedError);
        return await this.executeWithErrorHandling(operation, alternativeContext);
      },
      
      // Use cached data as fallback
      USE_CACHED_DATA: async () => {
        const cachedData = await this.getCachedData(operation, context);
        return {
          success: true,
          data: cachedData,
          source: 'cache',
          stale: this.isCacheStale(cachedData)
        };
      },
      
      // Degrade to simplified operation
      DEGRADE_OPERATION: async () => {
        const simplifiedOperation = this.createSimplifiedOperation(operation, enrichedError);
        return await this.executeWithErrorHandling(simplifiedOperation, context);
      },
      
      // Use default/fallback data
      USE_DEFAULT_DATA: async () => {
        const defaultData = this.getDefaultData(operation, context);
        return {
          success: true,
          data: defaultData,
          source: 'default',
          fallback: true
        };
      }
    };
    
    const recoveryMethod = recoveryMethods[recoveryStrategy.method];
    if (recoveryMethod) {
      return await recoveryMethod();
    } else {
      throw new Error(\`Unknown recovery method: \${recoveryStrategy.method}\`);
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Practical Try-Catch Patterns */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🔧 Practical Try-Catch Implementation Patterns
                      </h4>
                      <p className="mb-4">
                        Learn proven try-catch patterns for common n8n workflow scenarios including API integrations, 
                        data processing, and external service communication.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🌐 API Integration Pattern:</h5>
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// API Integration with Comprehensive Error Handling
async function robustApiCall(apiConfig, requestData) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      // Pre-flight validation
      if (!apiConfig.endpoint || !apiConfig.headers) {
        throw new Error('Invalid API configuration');
      }
      
      // Execute API call with timeout
      const response = await fetch(apiConfig.endpoint, {
        method: apiConfig.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiConfig.headers
        },
        body: JSON.stringify(requestData),
        timeout: apiConfig.timeout || 30000
      });
      
      // Check response status
      if (!response.ok) {
        throw new Error(\`API call failed: \${response.status} \${response.statusText}\`);
      }
      
      // Parse and validate response
      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      return {
        success: true,
        data: data,
        status: response.status,
        headers: response.headers
      };
      
    } catch (error) {
      attempt++;
      
      // Classify error type for specific handling
      if (error.name === 'TimeoutError') {
        console.warn(\`API timeout on attempt \${attempt}, retrying...\`);
        await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
        continue;
      }
      
      if (error.name === 'NetworkError') {
        console.warn(\`Network error on attempt \${attempt}, retrying...\`);
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      if (response && response.status >= 500) {
        console.warn(\`Server error (5xx) on attempt \${attempt}, retrying...\`);
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      // Non-retryable errors (4xx, validation errors, etc.)
      throw {
        ...error,
        attempt: attempt,
        retryable: false,
        context: { apiConfig, requestData }
      };
    }
  }
  
  // All retries exhausted
  throw new Error(\`API call failed after \${maxRetries} attempts\`);
}`}
                          </pre>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📊 Data Processing Pattern:</h5>
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Robust Data Processing with Error Recovery
async function processDataWithRecovery(inputData, processingConfig) {
  const results = {
    processed: [],
    failed: [],
    warnings: []
  };
  
  try {
    // Validate input data structure
    if (!Array.isArray(inputData)) {
      throw new Error('Input data must be an array');
    }
    
    // Process each item with individual error handling
    for (let i = 0; i < inputData.length; i++) {
      const item = inputData[i];
      
      try {
        // Validate individual item
        if (!item || typeof item !== 'object') {
          throw new Error(\`Invalid item at index \${i}\`);
        }
        
        // Apply transformations with validation
        const transformedItem = await applyTransformations(item, processingConfig);
        
        // Validate transformed result
        if (!isValidTransformedItem(transformedItem)) {
          throw new Error(\`Transformation failed validation for item \${i}\`);
        }
        
        results.processed.push({
          index: i,
          original: item,
          transformed: transformedItem,
          timestamp: new Date().toISOString()
        });
        
      } catch (itemError) {
        // Handle individual item errors without stopping entire process
        results.failed.push({
          index: i,
          item: item,
          error: itemError.message,
          timestamp: new Date().toISOString()
        });
        
        // Apply fallback processing if available
        if (processingConfig.useFallbackForErrors) {
          try {
            const fallbackResult = await applyFallbackProcessing(item);
            results.warnings.push({
              index: i,
              message: 'Used fallback processing',
              fallbackResult: fallbackResult
            });
          } catch (fallbackError) {
            console.warn(\`Fallback processing failed for item \${i}:, fallbackError\`);
          }
        }
      }
    }
    
    return {
      success: results.failed.length === 0,
      totalItems: inputData.length,
      processedCount: results.processed.length,
      failedCount: results.failed.length,
      warningCount: results.warnings.length,
      results: results
    };
    
  } catch (error) {
    // Handle catastrophic processing errors
    return {
      success: false,
      error: error.message,
      results: results,
      context: { processingConfig, inputDataLength: inputData?.length }
    };
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Implementation Checklist */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        ✅ Try-Catch Implementation Checklist
                      </h4>
                      <p className="mb-4">
                        Follow this comprehensive checklist to implement robust try-catch error handling 
                        across all critical operations in your n8n workflows.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🔧 Implementation Steps:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Identify critical operations requiring try-catch</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement error classification logic</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Add comprehensive error logging</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure recovery mechanisms</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Test error scenarios thoroughly</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Best Practices:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Always provide meaningful error messages</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Include sufficient context in error logs</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement graceful degradation strategies</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Monitor error rates and patterns</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Document error handling procedures</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Try-Catch Mastery Achieved!</h4>
                      <p className="mb-4">
                        You've mastered comprehensive try-catch implementation with intelligent error handling, 
                        automatic recovery mechanisms, and robust data processing patterns. Ready for retry strategies!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Try-Catch Implementation</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Retry Strategies</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Retry Strategies Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔄 Intelligent Retry Strategies &amp; Recovery
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated retry mechanisms that intelligently handle transient failures, 
                        network issues, and temporary service unavailability to maximize workflow reliability.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🎯 Retry Strategy Types</h5>
                          <div className="space-y-3 text-sm">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                              <strong>Linear Backoff:</strong> Fixed delay between retries
                            </div>
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                              <strong>Exponential Backoff:</strong> Increasing delay (2^n)
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                              <strong>Jittered Backoff:</strong> Random delay variation
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                              <strong>Circuit Breaker:</strong> Fail-fast after threshold
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">🔍 Retry Conditions</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Network Errors:</strong> Connection timeouts, DNS failures</div>
                            <div><strong>Server Errors:</strong> 5xx HTTP status codes</div>
                            <div><strong>Rate Limiting:</strong> 429 Too Many Requests</div>
                            <div><strong>Temporary Failures:</strong> Service unavailable (503)</div>
                            <div><strong>Authentication:</strong> Token expiration (401)</div>
                            <div><strong>Resource Conflicts:</strong> Database locks, file access</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">⚙️ Advanced Retry Engine:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Intelligent Retry System
class IntelligentRetryEngine {
  constructor() {
    this.retryStrategies = this.initializeRetryStrategies();
    this.circuitBreakers = new Map();
    this.retryMetrics = new RetryMetricsCollector();
    this.adaptiveConfig = new AdaptiveRetryConfig();
  }
  
  // Main retry execution with intelligent strategy selection
  async executeWithRetry(operation, options = {}) {
    const config = this.buildRetryConfig(operation, options);
    const operationId = this.generateOperationId();
    
    let lastError;
    let attempt = 0;
    const startTime = Date.now();
    
    // Check circuit breaker status
    if (this.isCircuitBreakerOpen(operation.name)) {
      throw new Error(\`Circuit breaker is OPEN for operation: \${operation.name}\`);
    }
    
    while (attempt < config.maxRetries) {
      attempt++;
      
      try {
        // Log retry attempt
        this.retryMetrics.logAttempt(operationId, attempt, operation.name);
        
        // Execute operation with timeout
        const result = await this.executeWithTimeout(operation, config.timeout);
        
        // Success - reset circuit breaker and log metrics
        this.resetCircuitBreaker(operation.name);
        this.retryMetrics.logSuccess(operationId, attempt, Date.now() - startTime);
        
        return {
          success: true,
          data: result,
          attempts: attempt,
          totalTime: Date.now() - startTime,
          strategy: config.strategy
        };
        
      } catch (error) {
        lastError = error;
        
        // Check if error is retryable
        if (!this.isRetryableError(error, config)) {
          this.retryMetrics.logNonRetryableError(operationId, error, attempt);
          break;
        }
        
        // Update circuit breaker
        this.updateCircuitBreaker(operation.name, error);
        
        // Don't delay on last attempt
        if (attempt < config.maxRetries) {
          const delay = this.calculateDelay(attempt, config, error);
          this.retryMetrics.logRetryDelay(operationId, attempt, delay);
          await this.sleep(delay);
        }
      }
    }
    
    // All retries exhausted
    this.retryMetrics.logFailure(operationId, lastError, attempt, Date.now() - startTime);
    throw this.createRetryExhaustedError(lastError, attempt, config);
  }
  
  // Calculate delay based on retry strategy
  calculateDelay(attempt, config, error) {
    let delay;
    
    switch (config.strategy) {
      case 'linear':
        delay = config.baseDelay * attempt;
        break;
        
      case 'exponential':
        delay = config.baseDelay * Math.pow(2, attempt - 1);
        break;
        
      case 'fibonacci':
        delay = config.baseDelay * this.fibonacci(attempt);
        break;
        
      case 'adaptive':
        delay = this.calculateAdaptiveDelay(attempt, config, error);
        break;
        
      default:
        delay = config.baseDelay;
    }
    
    // Apply jitter to prevent thundering herd
    if (config.jitter) {
      const jitterAmount = delay * 0.1; // 10% jitter
      delay += (Math.random() - 0.5) * 2 * jitterAmount;
    }
    
    // Apply maximum delay cap
    return Math.min(delay, config.maxDelay);
  }
  
  // Determine if error is retryable
  isRetryableError(error, config) {
    const errorType = error.constructor.name;
    const errorMessage = error.message.toLowerCase();
    
    // Check explicit non-retryable errors
    if (config.nonRetryableErrors.includes(errorType)) {
      return false;
    }
    
    // Check explicit retryable errors
    if (config.retryableErrors.includes(errorType)) {
      return true;
    }
    
    // HTTP status code based retry logic
    if (error.status) {
      // 4xx errors are generally not retryable (except 408, 429)
      if (error.status >= 400 && error.status < 500) {
        return error.status === 408 || error.status === 429;
      }
      
      // 5xx errors are generally retryable
      if (error.status >= 500) {
        return true;
      }
    }
    
    // Message-based retry logic
    const retryablePatterns = [
      /timeout/i, /connection/i, /network/i, /temporary/i,
      /rate limit/i, /too many requests/i, /service unavailable/i
    ];
    
    return retryablePatterns.some(pattern => pattern.test(errorMessage));
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Retry Pattern Examples */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🔧 Advanced Retry Pattern Implementations
                      </h4>
                      <p className="mb-4">
                        Explore sophisticated retry patterns including exponential backoff with jitter, 
                        circuit breakers, and adaptive retry strategies for maximum reliability.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">⚡ Exponential Backoff with Jitter:</h5>
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Exponential Backoff with Full Jitter Implementation
async function exponentialBackoffWithJitter(operation, maxRetries = 5) {
  const baseDelay = 1000; // 1 second base delay
  const maxDelay = 32000; // 32 second maximum delay
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      
      // Calculate exponential delay: 2^(attempt-1) * baseDelay
      const exponentialDelay = Math.min(
        baseDelay * Math.pow(2, attempt - 1),
        maxDelay
      );
      
      // Add full jitter (randomize between 0 and exponentialDelay)
      const jitteredDelay = Math.random() * exponentialDelay;
      
      console.log(\`Attempt \${attempt} failed, retrying in \${Math.round(jitteredDelay)}ms\`);
      await sleep(jitteredDelay);
    }
  }
}

// Smart retry with conditional logic
async function smartRetryWithConditions(apiCall, requestData) {
  const retryConfig = {
    maxRetries: 5,
    baseDelay: 1000,
    backoffMultiplier: 2,
    maxDelay: 30000
  };
  
  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const result = await apiCall(requestData);
      return result;
      
    } catch (error) {
      // Don't retry on client errors (4xx except 408, 429)
      if (error.status >= 400 && error.status < 500) {
        if (error.status !== 408 && error.status !== 429) {
          throw error; // Non-retryable client error
        }
      }
      
      // Special handling for rate limiting
      if (error.status === 429) {
        const retryAfter = error.headers['retry-after'];
        if (retryAfter) {
          const delay = parseInt(retryAfter) * 1000;
          console.log(\`Rate limited, waiting \${delay}ms as instructed\`);
          await sleep(delay);
          continue;
        }
      }
      
      if (attempt === retryConfig.maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
        retryConfig.maxDelay
      );
      
      await sleep(delay);
    }
  }
}`}
                          </pre>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🔄 Circuit Breaker Pattern:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Circuit States 🚦</strong>
                              <div className="mt-1 space-y-1">
                                <div>• <span className="text-green-600">CLOSED:</span> Normal operation</div>
                                <div>• <span className="text-red-600">OPEN:</span> Fail-fast mode</div>
                                <div>• <span className="text-yellow-600">HALF-OPEN:</span> Testing recovery</div>
                              </div>
                            </div>
                            <div>
                              <strong>Thresholds 📊</strong>
                              <div className="mt-1 space-y-1">
                                <div>• Failure rate: &gt;50% in 1 min</div>
                                <div>• Consecutive failures: &gt;5</div>
                                <div>• Recovery timeout: 60 seconds</div>
                                <div>• Test requests: 3 max in half-open</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Implementation Guide */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🛠️ Retry Strategy Implementation Guide
                      </h4>
                      <p className="mb-4">
                        Follow this comprehensive guide to implement intelligent retry strategies 
                        that maximize success rates while preventing system overload.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Implementation Checklist:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Identify operations requiring retry logic</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Configure appropriate retry strategies</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Set up exponential backoff with jitter</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Implement circuit breaker patterns</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Add retry metrics and monitoring</span>
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Define retryable vs non-retryable errors</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Configure timeout values appropriately</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Test retry scenarios thoroughly</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Implement adaptive retry adjustments</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Document retry configurations</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📊 Retry Strategy Comparison:</h5>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2">Strategy</th>
                                  <th className="text-left p-2">Delay Pattern</th>
                                  <th className="text-left p-2">Best For</th>
                                  <th className="text-left p-2">Load Impact</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="p-2">Linear</td>
                                  <td className="p-2">1s, 2s, 3s, 4s</td>
                                  <td className="p-2">Predictable delays</td>
                                  <td className="p-2">Medium</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="p-2">Exponential</td>
                                  <td className="p-2">1s, 2s, 4s, 8s</td>
                                  <td className="p-2">High traffic scenarios</td>
                                  <td className="p-2">Low</td>
                                </tr>
                                <tr>
                                  <td className="p-2">Jittered</td>
                                  <td className="p-2">Random variation</td>
                                  <td className="p-2">Preventing thundering herd</td>
                                  <td className="p-2">Lowest</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Retry Strategy Mastery Complete!</h4>
                      <p className="mb-4">
                        You've mastered intelligent retry strategies with exponential backoff, circuit breakers, 
                        and adaptive algorithms. Ready to implement advanced fallback workflows!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Retry Strategies</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Fallback Workflows</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'error-step-5',
              title: 'Fallback Workflows',
              description: 'Create alternative execution paths',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Fallback Workflows Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🔄 Advanced Fallback Workflows &amp; Recovery Paths
                      </h4>
                      <p className="mb-4">
                        Design and implement intelligent fallback workflows that automatically activate 
                        when primary operations fail, ensuring business continuity and data integrity.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-300">🎯 Fallback Types</h5>
                          <div className="space-y-3 text-sm">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                              <strong>Data Fallback:</strong> Use cached or default data
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                              <strong>Service Fallback:</strong> Switch to backup services
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                              <strong>Process Fallback:</strong> Simplified workflow paths
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                              <strong>Manual Fallback:</strong> Queue for manual processing
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">⚡ Implementation Strategy</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Priority Levels:</strong> Primary, Secondary, Emergency</div>
                            <div><strong>Trigger Conditions:</strong> Error types, timeout thresholds</div>
                            <div><strong>Data Validation:</strong> Quality checks for fallback data</div>
                            <div><strong>Recovery Monitoring:</strong> Automatic restoration detection</div>
                            <div><strong>Escalation Paths:</strong> Human intervention triggers</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🏗️ Advanced Fallback Architecture:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Fallback Workflow System
class AdvancedFallbackManager {
  constructor() {
    this.fallbackChains = new Map();
    this.recoveryMonitor = new RecoveryMonitor();
    this.dataQualityChecker = new DataQualityChecker();
    this.escalationManager = new EscalationManager();
  }
  
  // Execute operation with comprehensive fallback strategy
  async executeWithFallback(operation, context = {}) {
    const fallbackChain = this.getFallbackChain(operation.type);
    const executionId = this.generateExecutionId();
    
    // Attempt primary operation
    try {
      const result = await this.executePrimaryOperation(operation, context);
      
      // Validate result quality
      const qualityCheck = await this.dataQualityChecker.validate(result, operation);
      if (!qualityCheck.passed) {
        throw new Error(\`Data quality check failed: \${qualityCheck.reason}\`);
      }
      
      return {
        success: true,
        data: result,
        source: 'primary',
        executionId: executionId,
        quality: qualityCheck.score
      };
      
    } catch (primaryError) {
      // Execute fallback chain
      return await this.executeFallbackChain(
        fallbackChain, 
        operation, 
        context, 
        primaryError, 
        executionId
      );
    }
  }
  
  // Execute fallback chain with intelligent decision making
  async executeFallbackChain(fallbackChain, operation, context, originalError, executionId) {
    for (let i = 0; i < fallbackChain.length; i++) {
      const fallbackStrategy = fallbackChain[i];
      
      try {
        // Check if fallback is applicable for this error type
        if (!this.isFallbackApplicable(fallbackStrategy, originalError, context)) {
          continue;
        }
        
        // Execute fallback strategy
        const fallbackResult = await this.executeFallbackStrategy(
          fallbackStrategy, 
          operation, 
          context, 
          originalError
        );
        
        // Validate fallback result
        const validationResult = await this.validateFallbackResult(
          fallbackResult, 
          fallbackStrategy, 
          operation
        );
        
        if (validationResult.valid) {
          // Start recovery monitoring
          this.recoveryMonitor.startMonitoring(operation, fallbackStrategy);
          
          return {
            success: true,
            data: fallbackResult.data,
            source: 'fallback',
            fallbackType: fallbackStrategy.type,
            fallbackLevel: i + 1,
            originalError: originalError,
            executionId: executionId,
            quality: validationResult.quality,
            recoveryMonitoring: true
          };
        }
        
      } catch (fallbackError) {
        // Log fallback failure and continue to next strategy
        console.warn(\`Fallback strategy \${fallbackStrategy.type} failed:, fallbackError\`);
        continue;
      }
    }
    
    // All fallbacks failed - escalate
    return await this.escalateToManualProcessing(
      operation, 
      context, 
      originalError, 
      executionId
    );
  }
  
  // Execute specific fallback strategy
  async executeFallbackStrategy(strategy, operation, context, originalError) {
    const strategyExecutors = {
      CACHED_DATA: async () => {
        const cache = await this.getCachedData(operation, context);
        if (!cache || this.isCacheStale(cache)) {
          throw new Error('No valid cached data available');
        }
        return { data: cache.data, cached: true, cacheAge: cache.age };
      },
      
      BACKUP_SERVICE: async () => {
        const backupConfig = this.getBackupServiceConfig(operation);
        const result = await this.callBackupService(backupConfig, context);
        return { data: result, source: 'backup_service' };
      },
      
      SIMPLIFIED_PROCESSING: async () => {
        const simplifiedOp = this.createSimplifiedOperation(operation, originalError);
        const result = await this.executeSimplifiedOperation(simplifiedOp, context);
        return { data: result, simplified: true };
      },
      
      DEFAULT_DATA: async () => {
        const defaultData = this.getDefaultData(operation, context);
        return { data: defaultData, source: 'default', confidence: 'low' };
      },
      
      QUEUE_FOR_MANUAL: async () => {
        const queueId = await this.queueForManualProcessing(operation, context, originalError);
        return { 
          data: null, 
          queued: true, 
          queueId: queueId,
          estimatedProcessingTime: this.estimateManualProcessingTime(operation)
        };
      }
    };
    
    const executor = strategyExecutors[strategy.type];
    if (!executor) {
      throw new Error(\`Unknown fallback strategy: \${strategy.type}\`);
    }
    
    return await executor();
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Implementation Guide */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🛠️ Fallback Workflow Implementation Guide
                      </h4>
                      <p className="mb-4">
                        Create robust fallback workflows that seamlessly handle failures while maintaining 
                        data quality and business continuity across all critical operations.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Implementation Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Map critical operations requiring fallbacks</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Design fallback priority chains</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement data quality validation</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up recovery monitoring</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure escalation pathways</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Test fallback scenarios thoroughly</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Best Practices:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Graceful Degradation:</strong> Maintain core functionality</div>
                            <div>• <strong>Data Freshness:</strong> Check cache validity and age</div>
                            <div>• <strong>Quality Metrics:</strong> Monitor fallback data quality</div>
                            <div>• <strong>Recovery Detection:</strong> Auto-restore when possible</div>
                            <div>• <strong>User Communication:</strong> Transparent status updates</div>
                            <div>• <strong>Performance Impact:</strong> Minimize fallback overhead</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Fallback Workflows Mastered!</h4>
                      <p className="mb-4">
                        You've implemented intelligent fallback workflows with multi-tier recovery strategies 
                        and quality validation. Ready to add circuit breaker protection!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Fallback Workflows</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Circuit Breakers</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'error-step-6',
              title: 'Circuit Breakers',
              description: 'Implement circuit breaker patterns',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Circuit Breaker Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        ⚡ Advanced Circuit Breaker Implementation
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated circuit breaker patterns to prevent cascade failures, 
                        protect system resources, and provide fast failure responses during outages.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">🟢 CLOSED State</h5>
                          <div className="space-y-2 text-xs">
                            <div>• Normal operation mode</div>
                            <div>• All requests pass through</div>
                            <div>• Monitor failure rate</div>
                            <div>• Track response times</div>
                            <div>• Reset failure counters on success</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">🔴 OPEN State</h5>
                          <div className="space-y-2 text-xs">
                            <div>• Fail-fast mode active</div>
                            <div>• Immediately reject requests</div>
                            <div>• Return cached/default data</div>
                            <div>• Preserve system resources</div>
                            <div>• Wait for timeout period</div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-yellow-700 dark:text-yellow-300">🟡 HALF-OPEN State</h5>
                          <div className="space-y-2 text-xs">
                            <div>• Testing recovery mode</div>
                            <div>• Limited request sampling</div>
                            <div>• Evaluate service health</div>
                            <div>• Quick transition decisions</div>
                            <div>• Gradual traffic increase</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">⚙️ Advanced Circuit Breaker Engine:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Circuit Breaker Implementation
class AdvancedCircuitBreaker {
  constructor(config = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      recoveryTimeout: config.recoveryTimeout || 60000,
      monitoringWindow: config.monitoringWindow || 60000,
      expectedResponseTime: config.expectedResponseTime || 1000,
      halfOpenMaxCalls: config.halfOpenMaxCalls || 3,
      ...config
    };
    
    this.state = 'CLOSED';
    this.failures = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.halfOpenAttempts = 0;
    this.responseTimeHistory = [];
    this.metrics = new CircuitBreakerMetrics();
  }
  
  // Execute operation with circuit breaker protection
  async execute(operation, context = {}) {
    const startTime = Date.now();
    
    // Check circuit breaker state
    this.updateState();
    
    if (this.state === 'OPEN') {
      this.metrics.recordRejection(operation.name);
      throw new CircuitBreakerOpenError(\`Circuit breaker is OPEN for \${operation.name}\`);
    }
    
    if (this.state === 'HALF_OPEN' && this.halfOpenAttempts >= this.config.halfOpenMaxCalls) {
      this.metrics.recordRejection(operation.name);
      throw new CircuitBreakerOpenError(\`Half-open limit exceeded for \${operation.name}\`);
    }
    
    try {
      // Execute operation with timeout
      const result = await this.executeWithTimeout(operation, context);
      const responseTime = Date.now() - startTime;
      
      // Record success
      this.recordSuccess(responseTime);
      this.metrics.recordSuccess(operation.name, responseTime);
      
      return {
        success: true,
        data: result,
        responseTime: responseTime,
        circuitState: this.state
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Record failure
      this.recordFailure(error, responseTime);
      this.metrics.recordFailure(operation.name, error, responseTime);
      
      throw error;
    }
  }
  
  // Record successful operation
  recordSuccess(responseTime) {
    this.responseTimeHistory.push(responseTime);
    if (this.responseTimeHistory.length > 100) {
      this.responseTimeHistory.shift();
    }
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      this.halfOpenAttempts++;
      
      // Check if we can close the circuit
      if (this.successCount >= this.config.halfOpenMaxCalls) {
        this.transitionToClosed();
      }
    } else if (this.state === 'CLOSED') {
      // Reset failure count on success in closed state
      this.failures = 0;
    }
  }
  
  // Record failed operation
  recordFailure(error, responseTime) {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.state === 'HALF_OPEN') {
      this.halfOpenAttempts++;
      this.transitionToOpen();
    } else if (this.state === 'CLOSED') {
      // Check if we should open the circuit
      if (this.shouldTripCircuit(error, responseTime)) {
        this.transitionToOpen();
      }
    }
  }
  
  // Determine if circuit should trip
  shouldTripCircuit(error, responseTime) {
    // Failure threshold check
    if (this.failures >= this.config.failureThreshold) {
      return true;
    }
    
    // Response time threshold check
    if (responseTime > this.config.expectedResponseTime * 3) {
      return true;
    }
    
    // Error severity check
    if (this.isCriticalError(error)) {
      return true;
    }
    
    return false;
  }
  
  // Update circuit breaker state based on time and conditions
  updateState() {
    if (this.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.config.recoveryTimeout) {
        this.transitionToHalfOpen();
      }
    }
  }
  
  // State transition methods
  transitionToOpen() {
    this.state = 'OPEN';
    this.lastFailureTime = Date.now();
    this.metrics.recordStateTransition('OPEN');
  }
  
  transitionToHalfOpen() {
    this.state = 'HALF_OPEN';
    this.halfOpenAttempts = 0;
    this.successCount = 0;
    this.metrics.recordStateTransition('HALF_OPEN');
  }
  
  transitionToClosed() {
    this.state = 'CLOSED';
    this.failures = 0;
    this.halfOpenAttempts = 0;
    this.successCount = 0;
    this.metrics.recordStateTransition('CLOSED');
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Implementation Guide */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🛠️ Circuit Breaker Implementation Strategy
                      </h4>
                      <p className="mb-4">
                        Deploy circuit breakers strategically across your n8n workflows to prevent 
                        cascade failures and maintain system stability during service outages.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Implementation Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Identify critical external dependencies</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure failure thresholds appropriately</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set recovery timeout periods</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement fallback responses</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Add circuit breaker monitoring</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Test state transitions thoroughly</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">⚡ Configuration Guidelines:</h5>
                          <div className="space-y-2 text-xs">
                            <div><strong>Failure Threshold:</strong> 5-10 failures (depends on criticality)</div>
                            <div><strong>Recovery Timeout:</strong> 30-60 seconds (service dependent)</div>
                            <div><strong>Half-Open Limit:</strong> 3-5 test requests</div>
                            <div><strong>Response Timeout:</strong> 3x normal response time</div>
                            <div><strong>Monitoring Window:</strong> 1-5 minutes rolling window</div>
                            <div><strong>Critical Services:</strong> Lower thresholds, faster recovery</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">⚡ Circuit Breaker Protection Activated!</h4>
                      <p className="mb-4">
                        You've implemented advanced circuit breaker patterns with intelligent state management 
                        and recovery strategies. Ready to add comprehensive error logging!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Circuit Breakers</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Error Logging</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Error Logging Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        📊 Advanced Error Logging &amp; Observability
                      </h4>
                      <p className="mb-4">
                        Implement comprehensive error logging systems that capture detailed context, 
                        enable quick debugging, and provide insights for proactive issue resolution.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">🎯 Logging Levels</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-red-500 rounded mr-2"></span>
                              <span><strong>ERROR:</strong> Critical failures requiring attention</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded mr-2"></span>
                              <span><strong>WARN:</strong> Potential issues or degraded performance</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-blue-500 rounded mr-2"></span>
                              <span><strong>INFO:</strong> Important events and state changes</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-gray-500 rounded mr-2"></span>
                              <span><strong>DEBUG:</strong> Detailed execution information</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">📝 Context Capture</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Request Context:</strong> User ID, session, workflow</div>
                            <div><strong>System Context:</strong> Memory, CPU, timestamps</div>
                            <div><strong>Error Context:</strong> Stack traces, error chains</div>
                            <div><strong>Business Context:</strong> Impact, affected users</div>
                            <div><strong>Technical Context:</strong> Dependencies, versions</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🔧 Advanced Logging System:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Error Logging Framework
class AdvancedErrorLogger {
  constructor(config = {}) {
    this.config = {
      logLevel: config.logLevel || 'INFO',
      maxLogSize: config.maxLogSize || 10485760, // 10MB
      rotationPolicy: config.rotationPolicy || 'daily',
      structured: config.structured !== false,
      sanitization: config.sanitization !== false,
      ...config
    };
    
    this.contextEnricher = new ContextEnricher();
    this.logFormatters = new Map();
    this.logDestinations = new Map();
    this.metricsCollector = new LogMetricsCollector();
    this.initializeFormatters();
    this.initializeDestinations();
  }
  
  // Main logging method with full context capture
  async logError(error, context = {}) {
    try {
      const enrichedContext = await this.enrichContext(error, context);
      const logEntry = this.createLogEntry('ERROR', error.message, enrichedContext, error);
      
      await this.writeToDestinations(logEntry);
      this.metricsCollector.recordError(error, enrichedContext);
      
      return logEntry.id;
    } catch (loggingError) {
      // Fallback logging - never let logging itself fail
      console.error('Critical: Logging system failure:', loggingError);
      this.writeFallbackLog(error, context, loggingError);
    }
  }
  
  // Enrich error context with comprehensive information
  async enrichContext(error, baseContext) {
    const timestamp = new Date().toISOString();
    const correlationId = baseContext.correlationId || this.generateCorrelationId();
    
    return {
      // Core identifiers
      timestamp: timestamp,
      correlationId: correlationId,
      logId: this.generateLogId(),
      
      // Error information
      error: {
        name: error.name,
        message: error.message,
        stack: this.sanitizeStackTrace(error.stack),
        code: error.code,
        severity: this.calculateErrorSeverity(error),
        category: this.categorizeError(error),
        fingerprint: this.generateErrorFingerprint(error)
      },
      
      // Request context
      request: {
        workflowId: baseContext.workflowId,
        executionId: baseContext.executionId,
        nodeId: baseContext.nodeId,
        userId: baseContext.userId,
        sessionId: baseContext.sessionId,
        userAgent: baseContext.userAgent,
        ipAddress: this.sanitizeIP(baseContext.ipAddress)
      },
      
      // System context
      system: {
        hostname: process.env.HOSTNAME,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid
      },
      
      // Application context
      application: {
        version: process.env.APP_VERSION,
        buildId: process.env.BUILD_ID,
        deploymentId: process.env.DEPLOYMENT_ID,
        region: process.env.AWS_REGION || process.env.REGION
      },
      
      // Performance context
      performance: {
        responseTime: baseContext.responseTime,
        cpuUsage: process.cpuUsage(),
        eventLoopDelay: await this.measureEventLoopDelay(),
        activeHandles: process._getActiveHandles().length,
        activeRequests: process._getActiveRequests().length
      },
      
      // Business context
      business: {
        impact: this.assessBusinessImpact(error, baseContext),
        affectedUsers: this.estimateAffectedUsers(baseContext),
        criticalPath: this.isCriticalPath(baseContext),
        escalationLevel: this.determineEscalationLevel(error, baseContext)
      }
    };
  }
  
  // Create structured log entry
  createLogEntry(level, message, context, error = null) {
    const logEntry = {
      id: context.logId,
      timestamp: context.timestamp,
      level: level,
      message: message,
      correlationId: context.correlationId,
      context: context
    };
    
    if (error) {
      logEntry.error = {
        type: error.constructor.name,
        message: error.message,
        stack: context.error.stack,
        fingerprint: context.error.fingerprint
      };
    }
    
    // Apply log formatters based on destination requirements
    return this.formatLogEntry(logEntry);
  }
  
  // Write to multiple log destinations
  async writeToDestinations(logEntry) {
    const writePromises = [];
    
    for (const [destinationName, destination] of this.logDestinations) {
      if (destination.shouldLog(logEntry.level)) {
        writePromises.push(
          destination.write(logEntry).catch(error => {
            console.error(\`Failed to write to \${destinationName}:, error\`);
          })
        );
      }
    }
    
    await Promise.allSettled(writePromises);
  }
  
  // Calculate error severity based on multiple factors
  calculateErrorSeverity(error) {
    let severity = 'MEDIUM';
    
    // Critical errors
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      severity = 'HIGH';
    }
    
    // Database or authentication errors
    if (error.message.includes('database') || error.message.includes('auth')) {
      severity = 'HIGH';
    }
    
    // Network or timeout errors
    if (error.name === 'TimeoutError' || error.message.includes('network')) {
      severity = 'MEDIUM';
    }
    
    // Validation errors
    if (error.name === 'ValidationError') {
      severity = 'LOW';
    }
    
    return severity;
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Implementation Checklist */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        ✅ Error Logging Implementation Guide
                      </h4>
                      <p className="mb-4">
                        Deploy comprehensive error logging that captures all necessary context for 
                        effective debugging and system monitoring across your n8n workflows.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Setup Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure log levels and rotation</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up structured logging format</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement context enrichment</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Add sensitive data sanitization</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure multiple log destinations</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Test log aggregation and search</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Best Practices:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Correlation IDs:</strong> Track requests across services</div>
                            <div>• <strong>Structured Format:</strong> Use JSON for machine parsing</div>
                            <div>• <strong>Context Capture:</strong> Include request and system state</div>
                            <div>• <strong>Performance Impact:</strong> Minimize logging overhead</div>
                            <div>• <strong>Data Privacy:</strong> Sanitize sensitive information</div>
                            <div>• <strong>Retention Policy:</strong> Manage log storage costs</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📊 Error Logging System Active!</h4>
                      <p className="mb-4">
                        You've implemented comprehensive error logging with full context capture 
                        and structured formats. Ready to configure intelligent alerting!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Error Logging</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Alert Configuration</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'error-step-8',
              title: 'Alert Configuration',
              description: 'Set up error alerts and notifications',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Alert Configuration Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-yellow-600 dark:text-yellow-400">
                        🚨 Intelligent Alert Configuration &amp; Notification
                      </h4>
                      <p className="mb-4">
                        Configure smart alerting systems that reduce noise, prioritize critical issues, 
                        and ensure the right people get notified at the right time with context.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-yellow-700 dark:text-yellow-300">🎯 Alert Severity Levels</h5>
                          <div className="space-y-3 text-sm">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                              <strong>CRITICAL:</strong> Immediate response required (5 min)
                            </div>
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                              <strong>HIGH:</strong> Response within 1 hour
                            </div>
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                              <strong>MEDIUM:</strong> Response within 4 hours
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                              <strong>LOW:</strong> Response within 24 hours
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">📱 Notification Channels</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>PagerDuty:</strong> Critical incidents &amp; escalation</div>
                            <div><strong>Slack/Teams:</strong> Team notifications &amp; updates</div>
                            <div><strong>Email:</strong> Detailed reports &amp; summaries</div>
                            <div><strong>SMS:</strong> Critical alerts for key personnel</div>
                            <div><strong>Webhooks:</strong> Integration with external systems</div>
                            <div><strong>Dashboard:</strong> Real-time visual monitoring</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🔔 Smart Alert Management System:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Alert Configuration System
class IntelligentAlertManager {
  constructor(config = {}) {
    this.config = config;
    this.alertRules = new Map();
    this.notificationChannels = new Map();
    this.escalationPolicies = new Map();
    this.alertSuppressionEngine = new AlertSuppressionEngine();
    this.metricsAggregator = new MetricsAggregator();
    this.setupDefaultRules();
  }
  
  // Process error and determine appropriate alerts
  async processErrorAlert(error, context) {
    try {
      // Calculate alert priority and routing
      const alertDetails = await this.calculateAlertDetails(error, context);
      
      // Check suppression rules
      if (this.alertSuppressionEngine.shouldSuppress(alertDetails)) {
        return { suppressed: true, reason: 'Suppression rule matched' };
      }
      
      // Create alert
      const alert = await this.createAlert(alertDetails);
      
      // Route to appropriate channels
      await this.routeAlert(alert);
      
      // Start escalation timer if critical
      if (alert.severity === 'CRITICAL') {
        this.startEscalationTimer(alert);
      }
      
      return { 
        alertId: alert.id, 
        severity: alert.severity,
        channels: alert.channels,
        escalationStarted: alert.severity === 'CRITICAL'
      };
      
    } catch (alertError) {
      // Fallback alerting
      await this.sendFallbackAlert(error, context, alertError);
    }
  }
  
  // Calculate comprehensive alert details
  async calculateAlertDetails(error, context) {
    const severity = this.calculateSeverity(error, context);
    const impact = await this.assessImpact(error, context);
    const urgency = this.calculateUrgency(error, context);
    const audience = this.determineAudience(severity, impact, context);
    
    return {
      id: this.generateAlertId(),
      timestamp: new Date().toISOString(),
      severity: severity,
      impact: impact,
      urgency: urgency,
      audience: audience,
      
      // Error details
      error: {
        type: error.constructor.name,
        message: error.message,
        fingerprint: this.generateErrorFingerprint(error),
        frequency: await this.getErrorFrequency(error),
        trend: await this.getErrorTrend(error)
      },
      
      // Context information
      context: {
        workflowId: context.workflowId,
        nodeId: context.nodeId,
        userId: context.userId,
        environment: process.env.NODE_ENV,
        region: process.env.AWS_REGION
      },
      
      // Business impact
      business: {
        affectedUsers: impact.affectedUsers,
        revenueImpact: impact.revenueImpact,
        serviceLevel: impact.serviceLevel,
        criticalPath: impact.criticalPath
      },
      
      // Technical details
      technical: {
        responseTime: context.responseTime,
        errorRate: await this.getCurrentErrorRate(),
        systemHealth: await this.getSystemHealthScore(),
        dependencies: await this.getAffectedDependencies(error)
      }
    };
  }
  
  // Create alert with rich context
  async createAlert(alertDetails) {
    const alert = {
      ...alertDetails,
      
      // Alert metadata
      title: this.generateAlertTitle(alertDetails),
      description: this.generateAlertDescription(alertDetails),
      runbook: this.getRunbookLink(alertDetails.error.type),
      
      // Routing information
      channels: this.determineChannels(alertDetails.severity, alertDetails.audience),
      escalationPolicy: this.getEscalationPolicy(alertDetails.severity),
      
      // Suppression and grouping
      groupKey: this.generateGroupKey(alertDetails),
      suppressionWindow: this.getSuppressionWindow(alertDetails.severity),
      
      // Actions and links
      actions: this.generateQuickActions(alertDetails),
      dashboardLinks: this.getDashboardLinks(alertDetails.context),
      logLinks: this.getLogLinks(alertDetails.context)
    };
    
    // Store alert for tracking
    await this.storeAlert(alert);
    
    return alert;
  }
  
  // Route alert to appropriate notification channels
  async routeAlert(alert) {
    const routingPromises = alert.channels.map(async (channel) => {
      try {
        const notifier = this.notificationChannels.get(channel.type);
        if (notifier) {
          const formattedAlert = this.formatAlertForChannel(alert, channel);
          await notifier.send(formattedAlert, channel.config);
        }
      } catch (error) {
        console.error(\`Failed to send alert via \${channel.type}:, error\`);
      }
    });
    
    await Promise.allSettled(routingPromises);
  }
  
  // Calculate alert severity based on multiple factors
  calculateSeverity(error, context) {
    let severityScore = 0;
    
    // Error type scoring
    const errorTypeScores = {
      'TypeError': 8,
      'ReferenceError': 8,
      'DatabaseError': 9,
      'AuthenticationError': 7,
      'TimeoutError': 5,
      'ValidationError': 2
    };
    
    severityScore += errorTypeScores[error.constructor.name] || 3;
    
    // Context scoring
    if (context.criticalPath) severityScore += 3;
    if (context.affectedUsers > 100) severityScore += 2;
    if (context.responseTime > 5000) severityScore += 1;
    
    // Environment scoring
    if (process.env.NODE_ENV === 'production') severityScore += 2;
    
    // Convert score to severity level
    if (severityScore >= 9) return 'CRITICAL';
    if (severityScore >= 6) return 'HIGH';
    if (severityScore >= 3) return 'MEDIUM';
    return 'LOW';
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Alert Rules Configuration */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        ⚙️ Alert Rules &amp; Escalation Configuration
                      </h4>
                      <p className="mb-4">
                        Configure intelligent alert rules that reduce noise through deduplication, 
                        grouping, and smart escalation based on business impact and response times.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Configuration Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Define severity thresholds and scoring</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure notification channels</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up escalation policies</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement alert suppression rules</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Create alert grouping strategies</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Test notification delivery paths</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Alert Optimization:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Deduplication:</strong> Group similar errors by fingerprint</div>
                            <div>• <strong>Rate Limiting:</strong> Prevent alert storms and flooding</div>
                            <div>• <strong>Business Hours:</strong> Adjust routing based on time</div>
                            <div>• <strong>Smart Routing:</strong> Route based on expertise areas</div>
                            <div>• <strong>Auto-Resolution:</strong> Close alerts when errors stop</div>
                            <div>• <strong>Feedback Loop:</strong> Learn from alert responses</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚨 Smart Alerting Configured!</h4>
                      <p className="mb-4">
                        You've implemented intelligent alert configuration with smart routing, 
                        escalation policies, and noise reduction. Ready for advanced error analytics!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Alert Configuration</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Error Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'error-step-9',
              title: 'Error Analytics',
              description: 'Analyze error patterns and trends',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Error Analytics Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        📈 Advanced Error Analytics &amp; Intelligence
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated error analytics that identify patterns, predict issues, 
                        and provide actionable insights for proactive system improvement and reliability.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-emerald-700 dark:text-emerald-300">📊 Pattern Analysis</h5>
                          <div className="space-y-2 text-xs">
                            <div>• Error frequency trends</div>
                            <div>• Temporal correlations</div>
                            <div>• Geographic patterns</div>
                            <div>• User behavior impact</div>
                            <div>• System load correlation</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🔮 Predictive Insights</h5>
                          <div className="space-y-2 text-xs">
                            <div>• Anomaly detection</div>
                            <div>• Failure prediction</div>
                            <div>• Capacity planning</div>
                            <div>• Performance degradation</div>
                            <div>• Resource exhaustion</div>
                          </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">🎯 Actionable Insights</h5>
                          <div className="space-y-2 text-xs">
                            <div>• Root cause analysis</div>
                            <div>• Impact quantification</div>
                            <div>• Optimization recommendations</div>
                            <div>• Prevention strategies</div>
                            <div>• Cost-benefit analysis</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🧠 AI-Powered Analytics Engine:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Error Analytics and Intelligence System
class ErrorAnalyticsEngine {
  constructor(config = {}) {
    this.config = config;
    this.patternDetector = new ErrorPatternDetector();
    this.anomalyDetector = new AnomalyDetectionEngine();
    this.mlPredictor = new MachineLearningPredictor();
    this.insightsGenerator = new InsightsGenerator();
    this.metricsStore = new TimeSeriesMetricsStore();
    this.reportGenerator = new ReportGenerator();
  }
  
  // Comprehensive error analysis with ML insights
  async analyzeErrors(timeWindow = '24h') {
    try {
      const errors = await this.getErrorsInWindow(timeWindow);
      
      // Multi-dimensional analysis
      const analysis = await Promise.all([
        this.analyzeFrequencyPatterns(errors),
        this.analyzeTemporalPatterns(errors),
        this.analyzeSpatialPatterns(errors),
        this.analyzeCorrelationPatterns(errors),
        this.detectAnomalies(errors),
        this.generatePredictions(errors),
        this.identifyRootCauses(errors)
      ]);
      
      // Synthesize insights
      const insights = await this.synthesizeInsights(analysis);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(insights);
      
      return {
        timeWindow: timeWindow,
        totalErrors: errors.length,
        analysis: this.structureAnalysis(analysis),
        insights: insights,
        recommendations: recommendations,
        dashboardData: this.prepareDashboardData(analysis, insights)
      };
      
    } catch (error) {
      console.error('Error analytics failed:', error);
      return this.generateFallbackAnalysis();
    }
  }
  
  // Analyze error frequency patterns with trend detection
  async analyzeFrequencyPatterns(errors) {
    const frequencyData = this.groupErrorsByFrequency(errors);
    const trends = this.calculateTrends(frequencyData);
    const seasonality = this.detectSeasonality(frequencyData);
    
    return {
      type: 'frequency',
      data: frequencyData,
      trends: trends,
      seasonality: seasonality,
      insights: {
        topErrors: this.getTopErrorsByFrequency(frequencyData, 10),
        emergingErrors: this.detectEmergingErrors(trends),
        decliningErrors: this.detectDecliningErrors(trends),
        cyclicalPatterns: seasonality.patterns
      }
    };
  }
  
  // Advanced temporal pattern analysis
  async analyzeTemporalPatterns(errors) {
    const timeGroups = {
      hourly: this.groupErrorsByHour(errors),
      daily: this.groupErrorsByDay(errors),
      weekly: this.groupErrorsByWeek(errors)
    };
    
    const correlations = await this.findTemporalCorrelations(timeGroups);
    const peakDetection = this.detectErrorPeaks(timeGroups);
    
    return {
      type: 'temporal',
      data: timeGroups,
      correlations: correlations,
      peaks: peakDetection,
      insights: {
        peakHours: peakDetection.hourly.peaks,
        quietPeriods: peakDetection.hourly.valleys,
        weekendEffect: this.analyzeWeekendEffect(timeGroups.weekly),
        businessHoursImpact: this.analyzeBusinessHoursImpact(timeGroups.hourly)
      }
    };
  }
  
  // ML-powered anomaly detection
  async detectAnomalies(errors) {
    const timeSeriesData = this.prepareTimeSeriesData(errors);
    const anomalies = await this.anomalyDetector.detect(timeSeriesData);
    
    const contextualAnomalies = await this.analyzeAnomalyContext(anomalies, errors);
    const severityScoring = this.scoreAnomalySeverity(contextualAnomalies);
    
    return {
      type: 'anomalies',
      detected: anomalies.length,
      anomalies: contextualAnomalies,
      severity: severityScoring,
      insights: {
        criticalAnomalies: contextualAnomalies.filter(a => a.severity === 'CRITICAL'),
        patternBreaks: this.identifyPatternBreaks(anomalies),
        systemStressIndicators: this.identifyStressIndicators(anomalies)
      }
    };
  }
  
  // Predictive error modeling
  async generatePredictions(errors) {
    const features = this.extractPredictiveFeatures(errors);
    const predictions = await this.mlPredictor.predict(features);
    
    return {
      type: 'predictions',
      horizon: '7d',
      predictions: predictions,
      confidence: predictions.confidence,
      insights: {
        expectedErrorVolume: predictions.volumeForecast,
        riskPeriods: predictions.highRiskPeriods,
        capacityRecommendations: predictions.capacityNeeds,
        preventiveActions: this.generatePreventiveActions(predictions)
      }
    };
  }
  
  // Advanced root cause analysis
  async identifyRootCauses(errors) {
    const causalChains = await this.buildCausalChains(errors);
    const correlationMatrix = this.buildCorrelationMatrix(errors);
    const systemFactors = await this.analyzeSystemFactors(errors);
    
    return {
      type: 'rootCauses',
      causalChains: causalChains,
      correlations: correlationMatrix,
      systemFactors: systemFactors,
      insights: {
        primaryCauses: this.rankPrimaryCauses(causalChains),
        systemicIssues: this.identifySystemicIssues(systemFactors),
        cascadingFailures: this.identifyCascadingFailures(causalChains),
        preventionOpportunities: this.identifyPreventionOpportunities(causalChains)
      }
    };
  }
  
  // Generate actionable recommendations
  async generateRecommendations(insights) {
    const recommendations = [];
    
    // Frequency-based recommendations
    if (insights.frequency.topErrors.length > 0) {
      recommendations.push({
        category: 'optimization',
        priority: 'HIGH',
        title: 'Address High-Frequency Errors',
        description: \`Focus on resolving the top \${insights.frequency.topErrors.length} most frequent errors\`,
        actions: insights.frequency.topErrors.map(error => ({
          type: 'investigate',
          target: error.fingerprint,
          impact: error.frequency
        })),
        estimatedImpact: this.calculateOptimizationImpact(insights.frequency.topErrors)
      });
    }
    
    // Anomaly-based recommendations
    if (insights.anomalies.criticalAnomalies.length > 0) {
      recommendations.push({
        category: 'monitoring',
        priority: 'CRITICAL',
        title: 'Investigate Critical Anomalies',
        description: 'Critical error pattern anomalies detected requiring immediate attention',
        actions: insights.anomalies.criticalAnomalies.map(anomaly => ({
          type: 'investigate',
          target: anomaly.context,
          urgency: 'immediate'
        }))
      });
    }
    
    return recommendations;
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Analytics Dashboard */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        📊 Error Analytics Dashboard Implementation
                      </h4>
                      <p className="mb-4">
                        Build comprehensive analytics dashboards that provide real-time insights, 
                        trend analysis, and predictive intelligence for proactive error management.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Implementation Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up time-series data collection</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement pattern detection algorithms</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure anomaly detection thresholds</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Build predictive models for forecasting</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Create interactive dashboard visualizations</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up automated insight reports</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Key Metrics to Track:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Error Rate:</strong> Errors per time period (trending)</div>
                            <div>• <strong>MTTR:</strong> Mean Time To Resolution (improving)</div>
                            <div>• <strong>MTBF:</strong> Mean Time Between Failures (increasing)</div>
                            <div>• <strong>Impact Score:</strong> Business impact quantification</div>
                            <div>• <strong>Resolution Efficiency:</strong> First-time fix rate</div>
                            <div>• <strong>Prediction Accuracy:</strong> ML model performance</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final Success */}
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎉 Complete Error Handling Mastery Achieved!</h4>
                      <p className="mb-4">
                        You've mastered the complete error handling pipeline: detection, classification, 
                        try-catch implementation, retry strategies, fallback workflows, circuit breakers, 
                        logging, alerting, and advanced analytics. Your n8n workflows are now bulletproof!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Error Analytics</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🏆 Complete Error Handling Mastery</span>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Resource Monitoring Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        📊 Advanced Resource Monitoring &amp; Observability
                      </h4>
                      <p className="mb-4">
                        Implement comprehensive resource monitoring to track CPU, memory, and system performance 
                        in real-time, enabling proactive optimization and preventing resource exhaustion.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">🎯 Key Metrics</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-red-500 rounded mr-2"></span>
                              <span><strong>CPU Usage:</strong> Process and system-wide utilization</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded mr-2"></span>
                              <span><strong>Memory:</strong> Heap, RSS, and garbage collection</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-green-500 rounded mr-2"></span>
                              <span><strong>Event Loop:</strong> Lag and blocking operations</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-purple-500 rounded mr-2"></span>
                              <span><strong>I/O Operations:</strong> File and network activity</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">📈 Monitoring Levels</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>System Level:</strong> OS metrics, disk, network</div>
                            <div><strong>Process Level:</strong> Node.js runtime metrics</div>
                            <div><strong>Application Level:</strong> n8n workflow performance</div>
                            <div><strong>Business Level:</strong> Execution success rates</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">⚙️ Advanced Resource Monitor:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Resource Monitoring System
class AdvancedResourceMonitor {
  constructor(config = {}) {
    this.config = {
      monitoringInterval: config.monitoringInterval || 5000,
      alertThresholds: {
        cpu: config.cpuThreshold || 80,
        memory: config.memoryThreshold || 85,
        eventLoop: config.eventLoopThreshold || 100
      },
      retentionPeriod: config.retentionPeriod || 7200000, // 2 hours
      ...config
    };
    
    this.metricsStore = new TimeSeriesMetricsStore();
    this.alertManager = new ResourceAlertManager();
    this.performanceAnalyzer = new PerformanceAnalyzer();
    this.dashboardUpdater = new DashboardUpdater();
    this.isMonitoring = false;
  }
  
  // Start comprehensive resource monitoring
  async startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🚀 Starting advanced resource monitoring...');
    
    // Initialize monitoring components
    await this.initializeMonitoring();
    
    // Start periodic metrics collection
    this.metricsInterval = setInterval(async () => {
      try {
        const metrics = await this.collectComprehensiveMetrics();
        await this.processMetrics(metrics);
      } catch (error) {
        console.error('Error collecting metrics:', error);
      }
    }, this.config.monitoringInterval);
    
    // Start real-time event loop monitoring
    this.startEventLoopMonitoring();
    
    // Initialize performance tracking
    this.startPerformanceTracking();
  }
  
  // Collect comprehensive system and application metrics
  async collectComprehensiveMetrics() {
    const timestamp = Date.now();
    
    // System-level metrics
    const systemMetrics = await this.collectSystemMetrics();
    
    // Process-level metrics
    const processMetrics = this.collectProcessMetrics();
    
    // Application-level metrics
    const appMetrics = await this.collectApplicationMetrics();
    
    // Performance metrics
    const performanceMetrics = await this.collectPerformanceMetrics();
    
    return {
      timestamp: timestamp,
      system: systemMetrics,
      process: processMetrics,
      application: appMetrics,
      performance: performanceMetrics,
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        environment: process.env.NODE_ENV
      }
    };
  }
  
  // Collect system-level metrics
  async collectSystemMetrics() {
    const os = require('os');
    const fs = require('fs').promises;
    
    return {
      cpu: {
        usage: await this.getCPUUsage(),
        loadAverage: os.loadavg(),
        cores: os.cpus().length
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        utilization: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
      },
      disk: await this.getDiskUsage(),
      network: await this.getNetworkStats(),
      uptime: os.uptime()
    };
  }
  
  // Collect Node.js process metrics
  collectProcessMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      pid: process.pid,
      activeHandles: process._getActiveHandles().length,
      activeRequests: process._getActiveRequests().length
    };
  }
  
  // Monitor event loop performance
  startEventLoopMonitoring() {
    const { performance } = require('perf_hooks');
    
    setInterval(() => {
      const start = performance.now();
      setImmediate(() => {
        const lag = performance.now() - start;
        
        this.metricsStore.recordEventLoopLag(lag);
        
        if (lag > this.config.alertThresholds.eventLoop) {
          this.alertManager.triggerEventLoopAlert(lag);
        }
      });
    }, 1000);
  }
  
  // Process and analyze collected metrics
  async processMetrics(metrics) {
    // Store metrics for historical analysis
    await this.metricsStore.store(metrics);
    
    // Check alert thresholds
    await this.checkAlertThresholds(metrics);
    
    // Update performance analysis
    await this.performanceAnalyzer.analyze(metrics);
    
    // Update real-time dashboard
    this.dashboardUpdater.update(metrics);
    
    // Clean old metrics based on retention policy
    await this.cleanOldMetrics(metrics.timestamp);
  }
  
  // Advanced CPU usage calculation
  async getCPUUsage() {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = process.hrtime();
      
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const endTime = process.hrtime(startTime);
        
        const totalTime = endTime[0] * 1000000 + endTime[1] / 1000;
        const cpuPercent = ((endUsage.user + endUsage.system) / totalTime) * 100;
        
        resolve({
          percentage: cpuPercent,
          user: endUsage.user,
          system: endUsage.system
        });
      }, 100);
    });
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Implementation Guide */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🛠️ Resource Monitoring Implementation
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Setup Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Install monitoring dependencies</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure metrics collection intervals</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up alert thresholds</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement dashboard visualization</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Monitoring Best Practices:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Baseline Establishment:</strong> Record normal patterns</div>
                            <div>• <strong>Trend Analysis:</strong> Identify gradual degradation</div>
                            <div>• <strong>Alert Tuning:</strong> Minimize false positives</div>
                            <div>• <strong>Historical Retention:</strong> Keep sufficient data</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📊 Resource Monitoring Active!</h4>
                      <p className="mb-4">
                        You've implemented comprehensive resource monitoring with real-time metrics collection. 
                        Ready to dive deeper with advanced resource profiling!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Resource Monitoring</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Resource Profiling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'resource-step-2',
              title: 'Resource Profiling',
              description: 'Profile workflow resource consumption',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Resource Profiling Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibent mb-3 text-cyan-600 dark:text-cyan-400">
                        🔍 Advanced Resource Profiling &amp; Analysis
                      </h4>
                      <p className="mb-4">
                        Implement deep resource profiling to identify performance bottlenecks, memory leaks, 
                        and optimization opportunities across your n8n workflow executions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-cyan-700 dark:text-cyan-300">🎯 Profiling Types</h5>
                          <div className="space-y-3 text-sm">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                              <strong>CPU Profiling:</strong> Function call analysis &amp; hotspots
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                              <strong>Memory Profiling:</strong> Heap snapshots &amp; leak detection
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                              <strong>I/O Profiling:</strong> Network &amp; file system operations
                            </div>
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                              <strong>Workflow Profiling:</strong> Node execution performance
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">📊 Analysis Areas</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Function Performance:</strong> Execution time distribution</div>
                            <div><strong>Memory Patterns:</strong> Allocation &amp; deallocation</div>
                            <div><strong>Resource Contention:</strong> Blocking operations</div>
                            <div><strong>Scalability Limits:</strong> Performance under load</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🔬 Advanced Resource Profiler:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Resource Profiling System
class AdvancedResourceProfiler {
  constructor(config = {}) {
    this.config = {
      profilingDuration: config.profilingDuration || 60000,
      samplingInterval: config.samplingInterval || 100,
      memorySnapshotInterval: config.memorySnapshotInterval || 10000,
      enableCPUProfiling: config.enableCPUProfiling !== false,
      enableMemoryProfiling: config.enableMemoryProfiling !== false,
      ...config
    };
    
    this.profiler = require('v8-profiler-next');
    this.heapDump = require('heapdump');
    this.profileResults = new Map();
    this.memorySnapshots = [];
    this.performanceMarks = new Map();
  }
  
  // Start comprehensive profiling session
  async startProfilingSession(sessionId, workflowConfig = {}) {
    console.log(\`🔬 Starting profiling session: \${sessionId}\`);
    
    const session = {
      id: sessionId,
      startTime: Date.now(),
      workflowConfig: workflowConfig,
      baseline: await this.captureBaseline(),
      profiles: {
        cpu: null,
        memory: [],
        io: [],
        workflow: []
      }
    };
    
    // Start CPU profiling if enabled
    if (this.config.enableCPUProfiling) {
      this.startCPUProfiling(sessionId);
    }
    
    // Start memory profiling if enabled
    if (this.config.enableMemoryProfiling) {
      this.startMemoryProfiling(sessionId);
    }
    
    // Start I/O monitoring
    this.startIOProfiling(sessionId);
    
    // Start workflow-specific profiling
    this.startWorkflowProfiling(sessionId, workflowConfig);
    
    this.profileResults.set(sessionId, session);
    return session;
  }
  
  // Capture system baseline before profiling
  async captureBaseline() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      timestamp: Date.now(),
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      eventLoopUtilization: await this.measureEventLoopUtilization(),
      activeHandles: process._getActiveHandles().length,
      activeRequests: process._getActiveRequests().length
    };
  }
  
  // Advanced CPU profiling with call stack analysis
  startCPUProfiling(sessionId) {
    const profileName = \`cpu-profile-\${sessionId}\`;
    
    this.profiler.startProfiling(profileName, true);
    
    setTimeout(() => {
      const profile = this.profiler.stopProfiling(profileName);
      
      const analysis = this.analyzeCPUProfile(profile);
      
      const session = this.profileResults.get(sessionId);
      if (session) {
        session.profiles.cpu = {
          raw: profile,
          analysis: analysis,
          hotspots: this.identifyHotspots(profile),
          callTree: this.buildCallTree(profile)
        };
      }
      
      profile.delete();
    }, this.config.profilingDuration);
  }
  
  // Memory profiling with leak detection
  startMemoryProfiling(sessionId) {
    const captureSnapshot = () => {
      const snapshot = {
        timestamp: Date.now(),
        usage: process.memoryUsage(),
        heapSnapshot: this.captureHeapSnapshot(),
        gcStats: this.getGCStats()
      };
      
      const session = this.profileResults.get(sessionId);
      if (session) {
        session.profiles.memory.push(snapshot);
        
        // Analyze for memory leaks
        if (session.profiles.memory.length > 3) {
          const leakAnalysis = this.analyzeMemoryLeaks(session.profiles.memory);
          snapshot.leakAnalysis = leakAnalysis;
        }
      }
    };
    
    // Capture initial snapshot
    captureSnapshot();
    
    // Schedule periodic snapshots
    const snapshotInterval = setInterval(() => {
      captureSnapshot();
    }, this.config.memorySnapshotInterval);
    
    // Stop after profiling duration
    setTimeout(() => {
      clearInterval(snapshotInterval);
      this.generateMemoryReport(sessionId);
    }, this.config.profilingDuration);
  }
  
  // Analyze CPU profile for performance insights
  analyzeCPUProfile(profile) {
    const nodes = profile.getNodes();
    const samples = profile.getSamples();
    
    const functionStats = new Map();
    const callFrequency = new Map();
    
    // Analyze function execution time
    nodes.forEach(node => {
      const functionName = node.getFunctionName() || 'anonymous';
      const selfTime = node.getSelfTime();
      const totalTime = node.getTotalTime();
      
      if (!functionStats.has(functionName)) {
        functionStats.set(functionName, {
          selfTime: 0,
          totalTime: 0,
          callCount: 0
        });
      }
      
      const stats = functionStats.get(functionName);
      stats.selfTime += selfTime;
      stats.totalTime += totalTime;
      stats.callCount++;
    });
    
    return {
      totalSamples: samples.length,
      functionStats: Array.from(functionStats.entries()),
      topFunctions: this.getTopFunctions(functionStats),
      performanceIssues: this.identifyPerformanceIssues(functionStats)
    };
  }
  
  // Detect memory leaks through pattern analysis
  analyzeMemoryLeaks(memorySnapshots) {
    if (memorySnapshots.length < 3) return null;
    
    const recent = memorySnapshots.slice(-3);
    const trends = {
      heapUsed: this.calculateTrend(recent.map(s => s.usage.heapUsed)),
      rss: this.calculateTrend(recent.map(s => s.usage.rss)),
      external: this.calculateTrend(recent.map(s => s.usage.external))
    };
    
    const leakIndicators = [];
    
    // Check for consistent memory growth
    if (trends.heapUsed.slope > 0 && trends.heapUsed.correlation > 0.8) {
      leakIndicators.push({
        type: 'heap_growth',
        severity: trends.heapUsed.slope > 1000000 ? 'high' : 'medium',
        description: 'Consistent heap memory growth detected'
      });
    }
    
    if (trends.rss.slope > 0 && trends.rss.correlation > 0.8) {
      leakIndicators.push({
        type: 'rss_growth',
        severity: trends.rss.slope > 5000000 ? 'high' : 'medium',
        description: 'Consistent RSS memory growth detected'
      });
    }
    
    return {
      hasLeaks: leakIndicators.length > 0,
      indicators: leakIndicators,
      trends: trends,
      recommendations: this.generateLeakRecommendations(leakIndicators)
    };
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Profiling Dashboard */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        📈 Profiling Results &amp; Analysis Dashboard
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Implementation Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Install profiling dependencies (v8-profiler-next)</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure profiling sessions</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up automated analysis</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Create performance reports</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Key Insights:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Function Hotspots:</strong> CPU-intensive operations</div>
                            <div>• <strong>Memory Leaks:</strong> Growing heap patterns</div>
                            <div>• <strong>I/O Bottlenecks:</strong> Blocking operations</div>
                            <div>• <strong>Scaling Issues:</strong> Performance under load</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔍 Resource Profiling Complete!</h4>
                      <p className="mb-4">
                        You've mastered advanced resource profiling with CPU analysis, memory leak detection, 
                        and performance insights. Ready to optimize memory management!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Resource Profiling</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Memory Management</span>
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
          description: 'Apply resource optimizations',
          steps: [
            {
              id: 'resource-step-3',
              title: 'Memory Management',
              description: 'Optimize memory usage and garbage collection',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Memory Management Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        🧠 Advanced Memory Management &amp; Optimization
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated memory management strategies to prevent leaks, optimize 
                        garbage collection, and ensure efficient memory utilization in n8n workflows.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-emerald-700 dark:text-emerald-300">🎯 Memory Areas</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Heap Memory:</strong> Object allocation &amp; garbage collection</div>
                            <div><strong>Stack Memory:</strong> Function calls &amp; local variables</div>
                            <div><strong>Buffer Pool:</strong> Binary data &amp; file operations</div>
                            <div><strong>External Memory:</strong> Native modules &amp; C++ objects</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">⚡ Optimization Strategies</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Object Pooling:</strong> Reuse expensive objects</div>
                            <div><strong>Stream Processing:</strong> Handle large data efficiently</div>
                            <div><strong>Weak References:</strong> Prevent circular references</div>
                            <div><strong>Memory Limits:</strong> Set appropriate boundaries</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🔧 Advanced Memory Manager:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive Memory Management System
class AdvancedMemoryManager {
  constructor(config = {}) {
    this.config = {
      maxHeapSize: config.maxHeapSize || 1024 * 1024 * 1024, // 1GB
      gcThreshold: config.gcThreshold || 0.8,
      objectPoolSize: config.objectPoolSize || 100,
      streamThreshold: config.streamThreshold || 10 * 1024 * 1024, // 10MB
      ...config
    };
    
    this.objectPools = new Map();
    this.memoryWatcher = new MemoryWatcher();
    this.gcOptimizer = new GCOptimizer();
    this.leakDetector = new MemoryLeakDetector();
    this.setupMemoryManagement();
  }
  
  // Initialize memory management system
  setupMemoryManagement() {
    // Monitor memory usage
    this.startMemoryMonitoring();
    
    // Optimize garbage collection
    this.optimizeGarbageCollection();
    
    // Set up object pools
    this.initializeObjectPools();
    
    // Configure memory limits
    this.setMemoryLimits();
  }
  
  // Intelligent object pooling for expensive objects
  createObjectPool(type, factory, resetFn) {
    if (!this.objectPools.has(type)) {
      this.objectPools.set(type, {
        available: [],
        inUse: new Set(),
        factory: factory,
        reset: resetFn || (() => {}),
        stats: {
          created: 0,
          reused: 0,
          maxSize: 0
        }
      });
    }
    
    return {
      acquire: () => this.acquireObject(type),
      release: (obj) => this.releaseObject(type, obj),
      getStats: () => this.objectPools.get(type).stats
    };
  }
  
  // Acquire object from pool or create new
  acquireObject(type) {
    const pool = this.objectPools.get(type);
    if (!pool) throw new Error(\`Object pool \${type} not found\`);
    
    let obj;
    
    if (pool.available.length > 0) {
      obj = pool.available.pop();
      pool.stats.reused++;
    } else {
      obj = pool.factory();
      pool.stats.created++;
    }
    
    pool.inUse.add(obj);
    pool.stats.maxSize = Math.max(pool.stats.maxSize, pool.inUse.size);
    
    return obj;
  }
  
  // Release object back to pool
  releaseObject(type, obj) {
    const pool = this.objectPools.get(type);
    if (!pool || !pool.inUse.has(obj)) return;
    
    pool.inUse.delete(obj);
    
    // Reset object state
    try {
      pool.reset(obj);
      
      // Add back to pool if under limit
      if (pool.available.length < this.config.objectPoolSize) {
        pool.available.push(obj);
      }
    } catch (error) {
      console.warn('Error resetting pooled object:', error);
    }
  }
  
  // Stream processing for large data sets
  async processLargeData(data, processor, options = {}) {
    const { chunkSize = 1000, useStreams = true } = options;
    
    // Use streaming for large datasets
    if (useStreams && this.shouldUseStreaming(data)) {
      return await this.streamProcess(data, processor, chunkSize);
    }
    
    // Use chunked processing for medium datasets
    return await this.chunkProcess(data, processor, chunkSize);
  }
  
  // Determine if streaming should be used
  shouldUseStreaming(data) {
    const estimatedSize = this.estimateDataSize(data);
    return estimatedSize > this.config.streamThreshold;
  }
  
  // Stream-based processing
  async streamProcess(data, processor, chunkSize) {
    const { Readable, Transform } = require('stream');
    const { pipeline } = require('stream/promises');
    
    const results = [];
    
    const sourceStream = Readable.from(this.chunkArray(data, chunkSize));
    
    const processStream = new Transform({
      objectMode: true,
      async transform(chunk, encoding, callback) {
        try {
          const result = await processor(chunk);
          callback(null, result);
        } catch (error) {
          callback(error);
        }
      }
    });
    
    const collectStream = new Transform({
      objectMode: true,
      transform(result, encoding, callback) {
        results.push(result);
        callback();
      }
    });
    
    await pipeline(sourceStream, processStream, collectStream);
    
    return results.flat();
  }
  
  // Memory-aware garbage collection optimization
  optimizeGarbageCollection() {
    // Monitor memory pressure
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsageRatio = memUsage.heapUsed / memUsage.heapTotal;
      
      // Trigger GC if memory pressure is high
      if (heapUsageRatio > this.config.gcThreshold) {
        this.triggerOptimizedGC();
      }
    }, 5000);
  }
  
  // Intelligent garbage collection triggering
  triggerOptimizedGC() {
    if (global.gc) {
      const before = process.memoryUsage();
      
      global.gc();
      
      const after = process.memoryUsage();
      const freed = before.heapUsed - after.heapUsed;
      
      console.log(\`GC freed \${Math.round(freed / 1024 / 1024)}MB\`);
      
      this.gcOptimizer.recordGCEvent(before, after, freed);
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Implementation Guide */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        ✅ Memory Management Implementation
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Setup Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure memory limits and thresholds</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement object pooling for expensive resources</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up stream processing for large datasets</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Enable garbage collection optimization</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Optimization Techniques:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Pool Reuse:</strong> 70-90% memory allocation reduction</div>
                            <div>• <strong>Streaming:</strong> Constant memory usage for large data</div>
                            <div>• <strong>Weak Maps:</strong> Automatic cleanup of references</div>
                            <div>• <strong>GC Tuning:</strong> Optimized collection timing</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🧠 Memory Management Optimized!</h4>
                      <p className="mb-4">
                        You've implemented advanced memory management with object pooling, stream processing, 
                        and intelligent garbage collection. Ready for CPU optimization!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Memory Management</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for CPU Optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'resource-step-4',
              title: 'CPU Optimization',
              description: 'Optimize CPU-intensive operations',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* CPU Optimization Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        ⚡ Advanced CPU Optimization &amp; Performance Tuning
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated CPU optimization techniques including worker threads, 
                        async processing, and computational load balancing for maximum performance.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-300">🎯 Optimization Areas</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Event Loop:</strong> Non-blocking operation optimization</div>
                            <div><strong>Worker Threads:</strong> CPU-intensive task distribution</div>
                            <div><strong>Process Clustering:</strong> Multi-core utilization</div>
                            <div><strong>Algorithm Efficiency:</strong> Computational complexity reduction</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">🚀 Performance Techniques</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Parallelization:</strong> Concurrent processing</div>
                            <div><strong>Caching:</strong> Computation result storage</div>
                            <div><strong>Lazy Loading:</strong> On-demand processing</div>
                            <div><strong>Batching:</strong> Bulk operation optimization</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">⚙️ Advanced CPU Optimizer:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Comprehensive CPU Optimization System
class AdvancedCPUOptimizer {
  constructor(config = {}) {
    this.config = {
      maxWorkers: config.maxWorkers || require('os').cpus().length,
      taskBatchSize: config.taskBatchSize || 100,
      cpuThreshold: config.cpuThreshold || 80,
      adaptiveScaling: config.adaptiveScaling !== false,
      ...config
    };
    
    this.workerPool = new WorkerPool(this.config.maxWorkers);
    this.taskQueue = new PriorityQueue();
    this.cpuMonitor = new CPUMonitor();
    this.performanceCache = new Map();
    this.loadBalancer = new LoadBalancer();
  }
  
  // Intelligent task processing with CPU optimization
  async processTask(task, options = {}) {
    const { priority = 'normal', useWorker = 'auto', cacheable = false } = options;
    
    // Check cache first if cacheable
    if (cacheable) {
      const cached = this.performanceCache.get(task.id);
      if (cached && !this.isCacheStale(cached)) {
        return cached.result;
      }
    }
    
    // Determine processing strategy
    const strategy = await this.determineProcessingStrategy(task, useWorker);
    
    let result;
    
    switch (strategy.type) {
      case 'worker':
        result = await this.processInWorker(task, strategy);
        break;
      case 'main_async':
        result = await this.processMainThreadAsync(task, strategy);
        break;
      case 'batch':
        result = await this.processBatch([task], strategy);
        break;
      default:
        result = await this.processMainThread(task);
    }
    
    // Cache result if applicable
    if (cacheable && result) {
      this.performanceCache.set(task.id, {
        result: result,
        timestamp: Date.now(),
        strategy: strategy.type
      });
    }
    
    return result;
  }
  
  // Determine optimal processing strategy
  async determineProcessingStrategy(task, userPreference) {
    const cpuUsage = await this.cpuMonitor.getCurrentUsage();
    const taskComplexity = this.analyzeTaskComplexity(task);
    const systemLoad = this.loadBalancer.getCurrentLoad();
    
    // High CPU usage - use worker threads
    if (cpuUsage > this.config.cpuThreshold) {
      return { type: 'worker', reason: 'high_cpu_usage' };
    }
    
    // Complex computation - use worker threads
    if (taskComplexity.score > 7) {
      return { type: 'worker', reason: 'complex_computation' };
    }
    
    // I/O intensive - use async main thread
    if (taskComplexity.ioIntensive) {
      return { type: 'main_async', reason: 'io_intensive' };
    }
    
    // Batchable tasks - process in batches
    if (this.taskQueue.size > this.config.taskBatchSize) {
      return { type: 'batch', reason: 'batch_optimization' };
    }
    
    return { type: 'main_async', reason: 'default' };
  }
  
  // Process CPU-intensive tasks in worker threads
  async processInWorker(task, strategy) {
    return new Promise((resolve, reject) => {
      this.workerPool.execute(task, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  
  // Async processing in main thread with event loop management
  async processMainThreadAsync(task, strategy) {
    const chunks = this.chunkTask(task);
    const results = [];
    
    for (const chunk of chunks) {
      // Process chunk
      const chunkResult = await this.processChunk(chunk);
      results.push(chunkResult);
      
      // Yield to event loop between chunks
      if (chunks.length > 1) {
        await this.yieldToEventLoop();
      }
    }
    
    return this.combineResults(results, task);
  }
  
  // Intelligent task chunking for event loop management
  chunkTask(task) {
    const complexity = this.analyzeTaskComplexity(task);
    
    if (complexity.score < 3) {
      return [task]; // Process as single chunk
    }
    
    // Calculate optimal chunk size based on complexity
    const baseChunkSize = 1000;
    const chunkSize = Math.max(10, baseChunkSize / complexity.score);
    
    return this.divideTaskIntoChunks(task, chunkSize);
  }
  
  // Yield control to event loop
  async yieldToEventLoop(delay = 0) {
    return new Promise(resolve => {
      if (delay > 0) {
        setTimeout(resolve, delay);
      } else {
        setImmediate(resolve);
      }
    });
  }
  
  // Adaptive batch processing
  async processBatch(tasks, strategy) {
    const batchSize = this.calculateOptimalBatchSize(tasks);
    const batches = this.createBatches(tasks, batchSize);
    const results = [];
    
    // Process batches with adaptive concurrency
    const concurrency = this.calculateOptimalConcurrency();
    
    for (let i = 0; i < batches.length; i += concurrency) {
      const batchGroup = batches.slice(i, i + concurrency);
      
      const batchPromises = batchGroup.map(async (batch, index) => {
        return await this.processSingleBatch(batch, index);
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.flat());
      
      // Monitor CPU usage and adjust if needed
      if (i + concurrency < batches.length) {
        await this.adaptivePause();
      }
    }
    
    return results;
  }
  
  // Monitor CPU usage and pause if needed
  async adaptivePause() {
    const cpuUsage = await this.cpuMonitor.getCurrentUsage();
    
    if (cpuUsage > this.config.cpuThreshold) {
      const pauseDuration = Math.min(1000, (cpuUsage - this.config.cpuThreshold) * 10);
      await this.yieldToEventLoop(pauseDuration);
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        📊 CPU Performance Optimization Results
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📋 Implementation Checklist:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up worker thread pool</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Implement adaptive task chunking</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure CPU monitoring</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Enable performance caching</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 Performance Gains:</h5>
                          <div className="space-y-2 text-sm">
                            <div>• <strong>Throughput:</strong> 3-5x improvement with workers</div>
                            <div>• <strong>Responsiveness:</strong> Event loop optimization</div>
                            <div>• <strong>CPU Utilization:</strong> Multi-core efficiency</div>
                            <div>• <strong>Cache Hit Rate:</strong> 80-90% for repeated operations</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">⚡ CPU Optimization Complete!</h4>
                      <p className="mb-4">
                        You've implemented advanced CPU optimization with worker threads, adaptive processing, 
                        and intelligent load balancing. Ready to configure resource limits!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ CPU Optimization</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Resource Limits</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'resource-step-5',
              title: 'Resource Limits',
              description: 'Set appropriate resource limits and quotas',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🛡️ Advanced Resource Limits &amp; Quotas
                      </h4>
                      <p className="mb-4">
                        Implement intelligent resource limits and quotas to prevent resource exhaustion 
                        and ensure stable workflow execution under varying load conditions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">🎯 Limit Types</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Memory Limits:</strong> Heap size &amp; buffer allocation</div>
                            <div><strong>CPU Limits:</strong> Processing time &amp; thread usage</div>
                            <div><strong>I/O Limits:</strong> File operations &amp; network calls</div>
                            <div><strong>Execution Limits:</strong> Workflow runtime &amp; iterations</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">⚙️ Smart Enforcement</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Graceful Degradation:</strong> Reduce quality before failing</div>
                            <div><strong>Dynamic Adjustment:</strong> Adapt limits based on load</div>
                            <div><strong>Priority Queuing:</strong> Critical tasks get more resources</div>
                            <div><strong>Circuit Breaking:</strong> Fail fast when limits exceeded</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🔧 Resource Limit Manager:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Resource Limit Management System
class ResourceLimitManager {
  constructor(config = {}) {
    this.limits = {
      memory: { max: 512 * 1024 * 1024, warning: 400 * 1024 * 1024 },
      cpu: { maxTime: 30000, maxUsage: 80 },
      concurrent: { maxWorkflows: 10, maxNodes: 100 },
      io: { maxFileSize: 50 * 1024 * 1024, maxConnections: 50 }
    };
    
    this.enforcer = new LimitEnforcer();
    this.monitor = new ResourceMonitor();
    this.quotaManager = new QuotaManager();
  }
  
  // Enforce resource limits with intelligent handling
  async enforceLimit(resource, usage, context = {}) {
    const limit = this.limits[resource.type];
    const enforcement = this.calculateEnforcement(usage, limit, context);
    
    switch (enforcement.action) {
      case 'allow':
        return { allowed: true };
      case 'warn':
        this.issueWarning(resource, usage, limit);
        return { allowed: true, warning: true };
      case 'throttle':
        await this.throttleResource(resource, enforcement.factor);
        return { allowed: true, throttled: true };
      case 'deny':
        return { allowed: false, reason: enforcement.reason };
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🛡️ Resource Limits Configured!</h4>
                      <p className="mb-4">Resource limits and quotas implemented successfully!</p>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">
                        📈 Advanced Horizontal Scaling &amp; Distribution
                      </h4>
                      <p className="mb-4">
                        Implement intelligent horizontal scaling strategies to distribute n8n workflows 
                        across multiple instances, enabling massive throughput and reliability.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-teal-700 dark:text-teal-300">🎯 Scaling Strategies</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Load Balancing:</strong> Distribute workflows intelligently</div>
                            <div><strong>Auto Scaling:</strong> Dynamic instance management</div>
                            <div><strong>Geo Distribution:</strong> Regional deployment optimization</div>
                            <div><strong>Failover:</strong> Automatic instance replacement</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">⚡ Performance Gains</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Throughput:</strong> 10x+ with proper scaling</div>
                            <div><strong>Availability:</strong> 99.9%+ uptime with redundancy</div>
                            <div><strong>Latency:</strong> Reduced through geo-distribution</div>
                            <div><strong>Cost Efficiency:</strong> Pay-per-use scaling</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🚀 Horizontal Scaling Engine:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Horizontal Scaling System
class HorizontalScalingManager {
  constructor(config = {}) {
    this.config = {
      minInstances: config.minInstances || 2,
      maxInstances: config.maxInstances || 20,
      targetCPU: config.targetCPU || 70,
      scaleUpThreshold: config.scaleUpThreshold || 80,
      scaleDownThreshold: config.scaleDownThreshold || 30,
      ...config
    };
    
    this.loadBalancer = new IntelligentLoadBalancer();
    this.instanceManager = new InstanceManager();
    this.healthMonitor = new HealthMonitor();
    this.autoScaler = new AutoScaler();
  }
  
  // Intelligent workflow distribution
  async distributeWorkflow(workflow, context = {}) {
    const availableInstances = await this.getHealthyInstances();
    const optimalInstance = await this.selectOptimalInstance(workflow, availableInstances);
    
    if (!optimalInstance) {
      // Trigger scale-up if no suitable instance
      await this.triggerScaleUp();
      optimalInstance = await this.waitForNewInstance();
    }
    
    return await this.executeOnInstance(workflow, optimalInstance, context);
  }
  
  // Auto-scaling based on metrics
  async autoScale() {
    const metrics = await this.collectScalingMetrics();
    const decision = this.makeScalingDecision(metrics);
    
    switch (decision.action) {
      case 'scale_up':
        await this.scaleUp(decision.count);
        break;
      case 'scale_down':
        await this.scaleDown(decision.count);
        break;
      case 'maintain':
        // No action needed
        break;
    }
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📈 Horizontal Scaling Active!</h4>
                      <p className="mb-4">
                        Advanced horizontal scaling implemented with intelligent load balancing and auto-scaling!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Horizontal Scaling</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Resource Pooling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'resource-step-7',
              title: 'Resource Pooling',
              description: 'Implement resource pooling strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        🏊 Advanced Resource Pooling &amp; Sharing
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated resource pooling strategies to maximize resource utilization, 
                        reduce overhead, and improve overall system efficiency.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-indigo-700 dark:text-indigo-300">🎯 Pool Types</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Connection Pools:</strong> Database &amp; HTTP connections</div>
                            <div><strong>Worker Pools:</strong> Thread &amp; process management</div>
                            <div><strong>Memory Pools:</strong> Buffer &amp; object reuse</div>
                            <div><strong>Compute Pools:</strong> Shared processing resources</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">💡 Efficiency Gains</h5>
                          <div className="space-y-2 text-sm">
                            <div><strong>Resource Reuse:</strong> 80-95% reduction in allocation</div>
                            <div><strong>Connection Management:</strong> Faster response times</div>
                            <div><strong>Memory Efficiency:</strong> Reduced GC pressure</div>
                            <div><strong>Scalability:</strong> Better resource distribution</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-2">🔄 Resource Pool Manager:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`// Advanced Resource Pooling System
class ResourcePoolManager {
  constructor(config = {}) {
    this.pools = new Map();
    this.config = {
      defaultPoolSize: config.defaultPoolSize || 10,
      maxPoolSize: config.maxPoolSize || 50,
      idleTimeout: config.idleTimeout || 300000, // 5 minutes
      healthCheckInterval: config.healthCheckInterval || 30000,
      ...config
    };
    
    this.healthChecker = new PoolHealthChecker();
    this.metrics = new PoolMetrics();
  }
  
  // Create and manage resource pools
  createPool(type, factory, validator, destroyer) {
    const pool = {
      type: type,
      available: [],
      inUse: new Set(),
      factory: factory,
      validator: validator || (() => true),
      destroyer: destroyer || (() => {}),
      stats: {
        created: 0,
        destroyed: 0,
        borrowed: 0,
        returned: 0,
        errors: 0
      }
    };
    
    this.pools.set(type, pool);
    this.initializePool(pool);
    
    return {
      acquire: () => this.acquireResource(type),
      release: (resource) => this.releaseResource(type, resource),
      getStats: () => pool.stats
    };
  }
  
  // Intelligent resource acquisition
  async acquireResource(poolType) {
    const pool = this.pools.get(poolType);
    if (!pool) throw new Error(\`Pool \${poolType} not found\`);
    
    let resource = null;
    
    // Try to get from available resources
    while (pool.available.length > 0 && !resource) {
      const candidate = pool.available.pop();
      
      if (await pool.validator(candidate)) {
        resource = candidate;
      } else {
        await pool.destroyer(candidate);
        pool.stats.destroyed++;
      }
    }
    
    // Create new resource if none available
    if (!resource) {
      resource = await pool.factory();
      pool.stats.created++;
    }
    
    pool.inUse.add(resource);
    pool.stats.borrowed++;
    
    return resource;
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎉 Complete Resource Optimization Mastery!</h4>
                      <p className="mb-4">
                        You've mastered the complete resource optimization pipeline: monitoring, profiling, 
                        memory management, CPU optimization, resource limits, horizontal scaling, and pooling. 
                        Your n8n workflows are now highly optimized and scalable!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Resource Pooling</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🏆 Complete Resource Mastery</span>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Logic Analysis Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔍 Comprehensive Workflow Logic Analysis &amp; Assessment
                      </h4>
                      <p className="mb-4">
                        Master the art of analyzing workflow logic to identify inefficiencies, redundancies, and optimization opportunities. 
                        This systematic approach helps you understand how your workflows make decisions and where improvements can be made.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-300">🎯 Analysis Framework</h5>
                          <div className="space-y-3">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">📊 Logic Flow Mapping</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Create visual maps of your workflow's decision paths, identifying all conditional branches, 
                                loops, and data transformations. This helps you see the complete logic structure at a glance.
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">🔄 Path Analysis</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Examine each possible execution path through your workflow, measuring complexity, 
                                execution time, and resource usage for different scenarios and data inputs.
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">📈 Performance Profiling</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Measure how long each logical branch takes to execute and identify bottlenecks 
                                in your decision-making processes that slow down overall workflow performance.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-green-700 dark:text-green-300">🔧 Analysis Techniques</h5>
                          <div className="space-y-3">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded text-sm">
                              <strong>Complexity Scoring:</strong> Rate each logic branch from 1-10 based on nested conditions, 
                              data transformations, and decision points to identify overly complex areas.
                            </div>
                            <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded text-sm">
                              <strong>Redundancy Detection:</strong> Find duplicate logic patterns, repeated conditions, 
                              and unnecessary decision points that can be consolidated or eliminated.
                            </div>
                            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded text-sm">
                              <strong>Dead Code Identification:</strong> Locate unreachable code paths, unused branches, 
                              and conditions that never evaluate to true in real-world scenarios.
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-sm">
                              <strong>Dependency Mapping:</strong> Understand how different parts of your workflow logic 
                              depend on each other and identify tight coupling that makes maintenance difficult.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">📋 Step-by-Step Logic Analysis Process:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Phase 1: Discovery</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                                <span>Document all decision points and conditional logic in your workflow</span>
                              </div>
                              <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                                <span>Map out all possible execution paths from start to finish</span>
                              </div>
                              <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                                <span>Identify data dependencies between different logic branches</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Phase 2: Analysis</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start">
                                <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                                <span>Measure execution frequency of each path using real workflow data</span>
                              </div>
                              <div className="flex items-start">
                                <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                                <span>Calculate performance metrics for each decision branch</span>
                              </div>
                              <div className="flex items-start">
                                <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5">6</span>
                                <span>Score complexity and identify optimization opportunities</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Practical Examples */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        💡 Real-World Logic Analysis Examples
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🎯 E-commerce Order Processing Analysis</h5>
                          <p className="text-sm mb-3">
                            Analyzing a complex order processing workflow revealed that 80% of orders followed the same simple path, 
                            but the logic was structured to handle edge cases first, causing unnecessary delays for common scenarios.
                          </p>
                          <div className="text-sm space-y-1">
                            <div><strong>Issue Found:</strong> Complex validation logic ran for every order, even simple ones</div>
                            <div><strong>Solution:</strong> Restructured to handle common cases first, complex validation only when needed</div>
                            <div><strong>Result:</strong> 60% reduction in average processing time for standard orders</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">🔄 Data Processing Pipeline Analysis</h5>
                          <p className="text-sm mb-3">
                            A data transformation workflow had nested conditions checking the same data format multiple times 
                            in different branches, creating redundant processing and potential inconsistencies.
                          </p>
                          <div className="text-sm space-y-1">
                            <div><strong>Issue Found:</strong> Same validation logic duplicated across 5 different branches</div>
                            <div><strong>Solution:</strong> Extracted common validation to a single reusable node at the beginning</div>
                            <div><strong>Result:</strong> 40% reduction in workflow complexity and easier maintenance</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Implementation Checklist */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        ✅ Logic Analysis Implementation Checklist
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-medium mb-2">📊 Analysis Tools Setup:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Install workflow visualization tools for logic mapping</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Set up performance monitoring for each decision branch</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Configure logging to track execution paths</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Create documentation templates for logic analysis</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-medium mb-2">🎯 Analysis Execution:</h5>
                          <div className="space-y-2 text-sm">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Complete logic flow mapping for all workflows</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Measure execution frequency of each path</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Identify and document optimization opportunities</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span>Prioritize improvements based on impact and effort</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔍 Logic Analysis Complete!</h4>
                      <p className="mb-4">
                        You've mastered workflow logic analysis! You can now systematically examine your workflows, 
                        identify inefficiencies, and create optimization roadmaps. Ready to optimize conditional logic!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Logic Analysis</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Conditional Optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'logic-step-2',
              title: 'Conditional Optimization',
              description: 'Optimize if/else conditions and switches',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Conditional Optimization Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        ⚡ Advanced Conditional Logic Optimization
                      </h4>
                      <p className="mb-4">
                        Transform your workflow's conditional logic from complex, nested structures into efficient, 
                        readable, and maintainable decision flows. Learn proven techniques to optimize if/else chains, 
                        switch statements, and complex boolean expressions for maximum performance.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-emerald-700 dark:text-emerald-300">🎯 Optimization Principles</h5>
                          <div className="space-y-3">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">🚀 Early Exit Strategy</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Structure conditions so the most common cases are evaluated first, allowing workflows 
                                to exit early and avoid unnecessary processing of complex edge cases.
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">🔄 Guard Clauses</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Replace deeply nested if-else structures with guard clauses that handle special cases 
                                first, making the main logic flow clearer and easier to understand.
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">📊 Condition Ordering</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Order conditions based on execution frequency and computational cost, putting 
                                fast, commonly-true conditions first to minimize overall evaluation time.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-300">🛠️ Optimization Techniques</h5>
                          <div className="space-y-3">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded text-sm">
                              <strong>Short-Circuit Evaluation:</strong> Use boolean operators (AND/OR) strategically 
                              so expensive conditions are only evaluated when necessary.
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded text-sm">
                              <strong>Lookup Tables:</strong> Replace complex if-else chains with data-driven 
                              lookup structures for faster and more maintainable logic.
                            </div>
                            <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded text-sm">
                              <strong>Polymorphic Dispatch:</strong> Use object-oriented patterns to eliminate 
                              conditional logic through method dispatch and inheritance.
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-sm">
                              <strong>State Machines:</strong> Model complex conditional flows as state machines 
                              for clearer logic and easier testing and debugging.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🔧 Conditional Optimization Workflow:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-emerald-600 dark:text-emerald-400">1. Analysis</h6>
                            <div className="space-y-1 text-sm">
                              <div>• Identify all conditional branches</div>
                              <div>• Measure execution frequency</div>
                              <div>• Calculate condition complexity</div>
                              <div>• Map data dependencies</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">2. Optimization</h6>
                            <div className="space-y-1 text-sm">
                              <div>• Reorder by frequency</div>
                              <div>• Simplify boolean expressions</div>
                              <div>• Extract common conditions</div>
                              <div>• Implement early exits</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">3. Validation</h6>
                            <div className="space-y-1 text-sm">
                              <div>• Test all execution paths</div>
                              <div>• Measure performance gains</div>
                              <div>• Verify logical equivalence</div>
                              <div>• Update documentation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Optimization Examples */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                        💡 Before &amp; After Optimization Examples
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">❌ Before: Inefficient Nested Conditions</h5>
                          <p className="text-sm mb-3">
                            A user authentication workflow checked premium features first, then basic permissions, 
                            even though 95% of users only needed basic access validation.
                          </p>
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                            <div className="text-red-600 dark:text-red-400 mb-2">Problematic Structure:</div>
                            <div>IF user.isPremium → check premium features → check basic access</div>
                            <div>ELSE IF user.isBasic → check basic access</div>
                            <div>ELSE → deny access</div>
                            <div className="mt-2 text-red-600 dark:text-red-400">Issues: Complex premium logic ran for all users first</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">✅ After: Optimized Early Exit</h5>
                          <p className="text-sm mb-3">
                            Restructured to handle the common case (basic users) first with immediate validation, 
                            only processing complex premium logic when actually needed.
                          </p>
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                            <div className="text-green-600 dark:text-green-400 mb-2">Optimized Structure:</div>
                            <div>IF user.isBasic → quick basic validation → continue</div>
                            <div>ELSE IF user.isPremium → detailed premium validation → continue</div>
                            <div>ELSE → immediate denial</div>
                            <div className="mt-2 text-green-600 dark:text-green-400">Result: 70% faster processing for 95% of users</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">⚡ Conditional Optimization Mastered!</h4>
                      <p className="mb-4">
                        You've learned to transform complex conditional logic into efficient, maintainable decision flows. 
                        Ready to simplify decision trees and eliminate complexity!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Conditional Optimization</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Decision Trees</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'logic-step-3',
              title: 'Decision Tree Simplification',
              description: 'Simplify complex decision trees and logic paths',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Decision Tree Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        🌳 Advanced Decision Tree Simplification &amp; Optimization
                      </h4>
                      <p className="mb-4">
                        Master the art of simplifying complex decision trees to create cleaner, more efficient, and 
                        easier-to-maintain workflow logic. Learn to identify redundant branches, consolidate similar 
                        paths, and restructure complex decision hierarchies for optimal performance.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-indigo-700 dark:text-indigo-300">🎯 Simplification Strategies</h5>
                          <div className="space-y-3">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">🔄 Branch Consolidation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Identify decision branches that lead to the same or similar outcomes and merge them 
                                into single, more general conditions that handle multiple scenarios efficiently.
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">📏 Depth Reduction</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Flatten deeply nested decision trees by extracting common logic, using lookup tables, 
                                or restructuring the decision flow to reduce cognitive complexity.
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded">
                              <h6 className="font-medium text-sm mb-2">🎯 Default Path Optimization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Establish smart default behaviors that handle the majority of cases, requiring 
                                explicit conditions only for special cases and exceptions.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-purple-700 dark:text-purple-300">🛠️ Advanced Techniques</h5>
                          <div className="space-y-3">
                            <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded text-sm">
                              <strong>Decision Tables:</strong> Convert complex nested logic into clear, tabular 
                              formats that are easier to understand, test, and maintain.
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded text-sm">
                              <strong>Rule Engines:</strong> Extract business logic into configurable rule sets 
                              that can be modified without changing workflow structure.
                            </div>
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded text-sm">
                              <strong>Pattern Matching:</strong> Use pattern matching constructs to simplify 
                              complex conditional structures into more readable formats.
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-sm">
                              <strong>Hierarchical Decomposition:</strong> Break complex decisions into smaller, 
                              manageable sub-decisions that can be optimized independently.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🌳 Decision Tree Analysis Framework:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-indigo-600 dark:text-indigo-400">Complexity Metrics</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded mr-2"></span>
                                <span><strong>Depth Score:</strong> Maximum nesting level (aim for &lt; 4)</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-orange-500 rounded mr-2"></span>
                                <span><strong>Branch Count:</strong> Total decision points (reduce by 30-50%)</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-yellow-500 rounded mr-2"></span>
                                <span><strong>Path Length:</strong> Average conditions per execution</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Optimization Targets</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded mr-2"></span>
                                <span><strong>Execution Speed:</strong> 40-60% faster decision making</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-blue-500 rounded mr-2"></span>
                                <span><strong>Maintainability:</strong> Easier to understand and modify</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-purple-500 rounded mr-2"></span>
                                <span><strong>Testing:</strong> Reduced test cases needed for coverage</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Practical Transformation Example */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">
                        🔄 Real-World Decision Tree Transformation
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-red-700 dark:text-red-300">Complex Original Structure</h5>
                          <p className="text-sm mb-3">
                            An e-commerce pricing workflow had 7 levels of nested conditions checking customer type, 
                            product category, seasonal discounts, bulk quantities, loyalty status, and regional pricing.
                          </p>
                          <div className="text-sm space-y-1">
                            <div><strong>Problems:</strong> 45 different execution paths, 15-second average decision time</div>
                            <div><strong>Maintenance:</strong> Required 3 developers to understand and modify safely</div>
                            <div><strong>Testing:</strong> 127 test cases needed for complete coverage</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">Simplified Optimized Structure</h5>
                          <p className="text-sm mb-3">
                            Restructured using a pricing rule engine with decision tables and hierarchical defaults, 
                            reducing complexity while maintaining all business logic functionality.
                          </p>
                          <div className="text-sm space-y-1">
                            <div><strong>Results:</strong> 12 execution paths, 2-second average decision time</div>
                            <div><strong>Maintenance:</strong> Junior developers can now safely make pricing changes</div>
                            <div><strong>Testing:</strong> 28 test cases cover all scenarios with better confidence</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                        <h5 className="font-medium mb-2">🔧 Transformation Techniques Used:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div><strong>1. Default Hierarchies:</strong> Standard pricing with exception handling</div>
                            <div><strong>2. Rule Tables:</strong> Customer type + product category = base price</div>
                            <div><strong>3. Modifier Stack:</strong> Sequential application of discounts and adjustments</div>
                          </div>
                          <div>
                            <div><strong>4. Early Termination:</strong> Stop processing when sufficient accuracy reached</div>
                            <div><strong>5. Cached Decisions:</strong> Remember recent pricing decisions to avoid recalculation</div>
                            <div><strong>6. Configuration Driven:</strong> Business rules stored in easily editable formats</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🌳 Decision Tree Simplification Complete!</h4>
                      <p className="mb-4">
                        You've mastered decision tree optimization! You can now transform complex nested logic into 
                        elegant, efficient decision structures. Ready to optimize data mapping and transformations!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Decision Tree Simplification</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Data Mapping</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">
                        🗺️ Advanced Data Mapping &amp; Transformation Optimization
                      </h4>
                      <p className="mb-4">
                        Master efficient data mapping techniques to transform complex data structures with minimal processing overhead. 
                        Learn to optimize transformation logic for speed, accuracy, and maintainability across large datasets.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-teal-700 dark:text-teal-300">🎯 Optimization Principles</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Minimal Traversal:</strong> Access each data element only once during transformation</div>
                            <div><strong>Lazy Evaluation:</strong> Compute transformations only when values are actually needed</div>
                            <div><strong>Batch Processing:</strong> Group similar transformations to reduce overhead</div>
                            <div><strong>Schema Validation:</strong> Validate data structure once, transform with confidence</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-300">🚀 Performance Gains</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Speed:</strong> 60-80% faster transformation processing</div>
                            <div><strong>Memory:</strong> 40-60% reduction in memory usage during mapping</div>
                            <div><strong>Scalability:</strong> Linear performance scaling with data size</div>
                            <div><strong>Reliability:</strong> Consistent transformation results with error handling</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🔄 Transformation Strategies:</h5>
                        <div className="space-y-3">
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">📋 Template-Based Mapping</h6>
                            <p className="text-xs">Create reusable transformation templates that can be applied to similar data structures, 
                            reducing duplicate mapping logic and ensuring consistency across workflows.</p>
                          </div>
                          <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🔄 Incremental Transformation</h6>
                            <p className="text-xs">Process data changes incrementally rather than re-transforming entire datasets, 
                            significantly improving performance for large or frequently updated data sources.</p>
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🎯 Selective Mapping</h6>
                            <p className="text-xs">Transform only the data fields actually needed by downstream processes, 
                            avoiding unnecessary computation and reducing processing time and memory usage.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🗺️ Data Mapping Optimized!</h4>
                      <p className="mb-4">You've mastered efficient data transformation techniques! Ready to optimize complex expressions and calculations!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'logic-step-5',
              title: 'Expression Optimization',
              description: 'Optimize complex expressions and calculations',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🧮 Advanced Expression &amp; Calculation Optimization
                      </h4>
                      <p className="mb-4">
                        Transform complex mathematical expressions, logical operations, and data calculations into 
                        highly efficient, optimized forms. Learn advanced techniques to reduce computational complexity 
                        and improve calculation performance across your workflows.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-orange-700 dark:text-orange-300">🎯 Optimization Techniques</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Algebraic Simplification:</strong> Reduce complex mathematical expressions to simpler equivalent forms</div>
                            <div><strong>Common Subexpression Elimination:</strong> Calculate shared portions once and reuse results</div>
                            <div><strong>Constant Folding:</strong> Pre-compute constant values at workflow design time</div>
                            <div><strong>Operator Precedence:</strong> Reorganize operations for optimal execution order</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-red-700 dark:text-red-300">⚡ Performance Impact</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Calculation Speed:</strong> 50-90% faster complex expression evaluation</div>
                            <div><strong>Resource Usage:</strong> Reduced CPU and memory consumption</div>
                            <div><strong>Numerical Stability:</strong> Improved accuracy for floating-point operations</div>
                            <div><strong>Maintainability:</strong> Simplified expressions easier to debug and modify</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🔧 Expression Analysis Framework:</h5>
                        <div className="space-y-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">📊 Complexity Assessment</h6>
                            <p className="text-xs">Analyze expression complexity by counting operations, identifying expensive functions 
                            (trigonometric, logarithmic), and measuring computational depth to prioritize optimization efforts.</p>
                          </div>
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🔄 Dependency Analysis</h6>
                            <p className="text-xs">Map variable dependencies to identify opportunities for caching, memoization, 
                            and incremental computation when input values change.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🧮 Expression Optimization Complete!</h4>
                      <p className="mb-4">You've mastered complex expression optimization! Ready to tackle loop and iteration optimization!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'logic-step-6',
              title: 'Loop Optimization',
              description: 'Optimize iteration patterns and data processing loops',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🔄 Advanced Loop &amp; Iteration Optimization
                      </h4>
                      <p className="mb-4">
                        Master the optimization of loops, iterations, and data processing patterns to achieve maximum efficiency. 
                        Learn advanced techniques for reducing iteration overhead, optimizing memory access patterns, 
                        and implementing efficient bulk processing strategies.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-purple-700 dark:text-purple-300">🎯 Loop Patterns</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Vectorization:</strong> Process multiple data elements simultaneously</div>
                            <div><strong>Loop Unrolling:</strong> Reduce iteration overhead by processing chunks</div>
                            <div><strong>Early Termination:</strong> Exit loops as soon as conditions are met</div>
                            <div><strong>Cache Optimization:</strong> Arrange data access for optimal memory usage</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-indigo-700 dark:text-indigo-300">🚀 Performance Gains</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Processing Speed:</strong> 3-10x faster iteration for large datasets</div>
                            <div><strong>Memory Efficiency:</strong> Better cache utilization and reduced allocations</div>
                            <div><strong>Scalability:</strong> Linear performance scaling with optimized algorithms</div>
                            <div><strong>Resource Management:</strong> Reduced CPU and memory pressure</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🔧 Optimization Strategies:</h5>
                        <div className="space-y-3">
                          <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">📦 Batch Processing</h6>
                            <p className="text-xs">Group related operations together to reduce setup overhead and improve 
                            throughput when processing large volumes of similar data items.</p>
                          </div>
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🎯 Parallel Processing</h6>
                            <p className="text-xs">Distribute loop iterations across multiple threads or processes 
                            to leverage multi-core systems and reduce overall processing time.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔄 Loop Optimization Mastered!</h4>
                      <p className="mb-4">You've conquered loop and iteration optimization! Ready to implement advanced branching strategies!</p>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        🌿 Advanced Branching Strategies &amp; Flow Control
                      </h4>
                      <p className="mb-4">
                        Master sophisticated branching strategies to create intelligent, adaptive workflow flows that optimize 
                        execution paths based on data characteristics, system conditions, and business requirements. 
                        Learn to implement dynamic routing and conditional execution patterns for maximum efficiency.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-emerald-700 dark:text-emerald-300">🎯 Branching Patterns</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Adaptive Routing:</strong> Choose execution paths based on real-time conditions</div>
                            <div><strong>Load-Based Branching:</strong> Route workflows based on system capacity</div>
                            <div><strong>Data-Driven Paths:</strong> Branch based on data volume, type, or quality</div>
                            <div><strong>Fallback Hierarchies:</strong> Implement graceful degradation strategies</div>
                          </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-teal-700 dark:text-teal-300">🚀 Strategic Benefits</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Efficiency:</strong> Always choose the optimal processing path</div>
                            <div><strong>Reliability:</strong> Automatic fallback when primary paths fail</div>
                            <div><strong>Scalability:</strong> Distribute load intelligently across resources</div>
                            <div><strong>Adaptability:</strong> Respond dynamically to changing conditions</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🧭 Strategic Branching Implementation:</h5>
                        <div className="space-y-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🎯 Intelligent Path Selection</h6>
                            <p className="text-xs">Implement smart decision-making algorithms that evaluate multiple factors 
                            (performance, cost, reliability) to choose the optimal execution path for each scenario.</p>
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🔄 Dynamic Load Balancing</h6>
                            <p className="text-xs">Create branching logic that automatically distributes workload across 
                            available resources based on current capacity and performance metrics.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🌿 Branching Strategies Optimized!</h4>
                      <p className="mb-4">You've mastered intelligent branching! Ready to eliminate redundancy and streamline workflows!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'logic-step-8',
              title: 'Redundancy Elimination',
              description: 'Remove unnecessary duplicate processing steps',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🗑️ Advanced Redundancy Elimination &amp; Streamlining
                      </h4>
                      <p className="mb-4">
                        Master the systematic identification and elimination of redundant processing steps, duplicate logic, 
                        and unnecessary operations. Learn to streamline workflows for maximum efficiency while maintaining 
                        all required functionality and ensuring data integrity.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-red-700 dark:text-red-300">🎯 Redundancy Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Duplicate Logic:</strong> Same conditions checked multiple times</div>
                            <div><strong>Repeated Calculations:</strong> Identical computations in different branches</div>
                            <div><strong>Unnecessary Transformations:</strong> Data converted back and forth</div>
                            <div><strong>Redundant Validations:</strong> Same data validated repeatedly</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-orange-700 dark:text-orange-300">💡 Elimination Benefits</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Performance:</strong> 30-70% reduction in processing time</div>
                            <div><strong>Resource Usage:</strong> Lower CPU and memory consumption</div>
                            <div><strong>Maintainability:</strong> Simpler, cleaner workflow structure</div>
                            <div><strong>Reliability:</strong> Fewer points of failure and error sources</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🔍 Systematic Redundancy Analysis:</h5>
                        <div className="space-y-3">
                          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">📊 Pattern Detection</h6>
                            <p className="text-xs">Use automated analysis tools to identify repeated patterns, duplicate code blocks, 
                            and similar logic structures across your workflow that can be consolidated.</p>
                          </div>
                          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🎯 Impact Assessment</h6>
                            <p className="text-xs">Evaluate each redundancy for elimination impact, ensuring that removing 
                            duplicate logic doesn't break functionality or introduce unexpected side effects.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🗑️ Redundancy Eliminated!</h4>
                      <p className="mb-4">You've streamlined your workflows by removing unnecessary redundancy! Ready for comprehensive logic testing!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'logic-step-9',
              title: 'Logic Testing',
              description: 'Test and validate optimized logic flows',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🧪 Comprehensive Logic Testing &amp; Validation
                      </h4>
                      <p className="mb-4">
                        Master advanced testing methodologies to ensure your optimized workflow logic maintains correctness, 
                        reliability, and performance. Learn systematic approaches to validate complex logic flows, 
                        test edge cases, and verify optimization benefits without introducing regressions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-blue-700 dark:text-blue-300">🎯 Testing Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Path Coverage:</strong> Test all possible execution routes</div>
                            <div><strong>Boundary Testing:</strong> Validate edge cases and limits</div>
                            <div><strong>Performance Validation:</strong> Measure optimization gains</div>
                            <div><strong>Regression Testing:</strong> Ensure no functionality is lost</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                          <h5 className="font-medium mb-3 text-green-700 dark:text-green-300">🔬 Testing Benefits</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Confidence:</strong> Verified optimization correctness</div>
                            <div><strong>Quality:</strong> Comprehensive coverage of scenarios</div>
                            <div><strong>Documentation:</strong> Clear validation of improvements</div>
                            <div><strong>Maintenance:</strong> Easier future modifications with test safety net</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        <h5 className="font-medium mb-3">🔬 Testing Framework Implementation:</h5>
                        <div className="space-y-3">
                          <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">📋 Automated Test Suites</h6>
                            <p className="text-xs">Create comprehensive automated test suites that validate all logic paths, 
                            verify data transformations, and measure performance metrics across different scenarios.</p>
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                            <h6 className="font-medium text-sm mb-2">🎯 Continuous Validation</h6>
                            <p className="text-xs">Implement continuous testing pipelines that automatically validate 
                            workflow logic whenever changes are made, ensuring optimizations don't break functionality.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎉 Complete Workflow Logic Mastery!</h4>
                      <p className="mb-4">
                        Congratulations! You've mastered the complete workflow logic optimization pipeline: analysis, 
                        conditional optimization, decision tree simplification, data mapping, expression optimization, 
                        loop optimization, branching strategies, redundancy elimination, and comprehensive testing. 
                        Your n8n workflows now feature highly optimized, efficient, and maintainable logic!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Logic Testing</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🏆 Complete Logic Mastery</span>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Cache Analysis Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔍 Comprehensive Cache Analysis &amp; Opportunity Identification
                      </h4>
                      <p className="mb-4">
                        Master the systematic analysis of your n8n workflows to identify optimal caching opportunities. 
                        Understanding what to cache, when to cache it, and how long to keep cached data is fundamental 
                        to building high-performance workflows that dramatically reduce processing time and resource consumption.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Cacheable Data Categories</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">📊 API Response Data</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                External API calls often return relatively static data that changes infrequently. 
                                User profiles, configuration data, product catalogs, and reference information are prime caching candidates.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>High Value:</strong> User profiles, product data, configuration settings</div>
                                <div><strong>Medium Value:</strong> Search results, filtered data, computed aggregations</div>
                                <div><strong>Low Value:</strong> Real-time data, transaction records, live metrics</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-emerald-600 dark:text-emerald-400">🧮 Computational Results</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Complex calculations, data transformations, and aggregations that require significant processing time. 
                                These are especially valuable when the same computation might be needed multiple times.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Mathematical Operations:</strong> Statistical calculations, data analysis results</div>
                                <div><strong>Data Transformations:</strong> Format conversions, data enrichment, normalization</div>
                                <div><strong>Business Logic:</strong> Pricing calculations, rule evaluations, report generation</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📈 Cache Impact Assessment</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">⚡ Performance Metrics</h6>
                              <div className="text-xs space-y-2">
                                <div className="flex justify-between">
                                  <span><strong>Response Time Reduction:</strong></span>
                                  <span className="text-green-600 dark:text-green-400">60-95%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span><strong>API Call Reduction:</strong></span>
                                  <span className="text-green-600 dark:text-green-400">70-90%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span><strong>CPU Usage Reduction:</strong></span>
                                  <span className="text-green-600 dark:text-green-400">40-80%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span><strong>Cost Savings:</strong></span>
                                  <span className="text-green-600 dark:text-green-400">50-85%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">🎯 ROI Calculation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Calculate return on investment by measuring time saved vs. cache implementation effort. 
                                High-frequency operations with expensive computations offer the highest ROI.
                              </p>
                              <div className="text-xs">
                                <div><strong>Formula:</strong> (Time Saved × Frequency × Cost/Hour) - Implementation Cost</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🔬 Detailed Analysis Framework</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">1. Data Flow Analysis</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Trace data movement through workflows</div>
                              <div>• Identify repeated data access patterns</div>
                              <div>• Map data dependencies and relationships</div>
                              <div>• Measure data access frequency and timing</div>
                              <div>• Document data freshness requirements</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">2. Performance Profiling</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Measure execution time for each operation</div>
                              <div>• Identify slowest workflow components</div>
                              <div>• Analyze resource consumption patterns</div>
                              <div>• Track API response times and failures</div>
                              <div>• Monitor computation-heavy operations</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">3. Business Impact Analysis</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Assess user experience improvements</div>
                              <div>• Calculate cost reduction potential</div>
                              <div>• Evaluate scalability benefits</div>
                              <div>• Measure reliability improvements</div>
                              <div>• Determine maintenance complexity</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Tools and Techniques */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🛠️ Advanced Analysis Tools &amp; Techniques
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                          <h5 className="font-medium mb-2">📊 Data Access Pattern Analysis</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            Understanding how your workflows access data is crucial for effective caching strategy. 
                            Analyze read/write ratios, access frequency distributions, and temporal patterns to optimize cache design.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h6 className="font-medium mb-1">🔄 Access Patterns</h6>
                              <div className="space-y-1 text-xs">
                                <div><strong>Sequential:</strong> Data accessed in order (good for prefetching)</div>
                                <div><strong>Random:</strong> Unpredictable access (requires intelligent prediction)</div>
                                <div><strong>Temporal Locality:</strong> Recently accessed data likely to be accessed again</div>
                                <div><strong>Spatial Locality:</strong> Nearby data often accessed together</div>
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium mb-1">📈 Frequency Analysis</h6>
                              <div className="space-y-1 text-xs">
                                <div><strong>Pareto Principle:</strong> 80% of requests target 20% of data</div>
                                <div><strong>Hot Data:</strong> Frequently accessed, high cache priority</div>
                                <div><strong>Warm Data:</strong> Moderately accessed, candidate for caching</div>
                                <div><strong>Cold Data:</strong> Rarely accessed, low cache priority</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔍 Cache Analysis Complete!</h4>
                      <p className="mb-4">
                        You've mastered comprehensive cache analysis! You can now systematically identify optimal caching 
                        opportunities and calculate their potential impact. Ready to design effective caching strategies!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Cache Analysis</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Strategy Design</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cache-step-2',
              title: 'Cache Strategy Design',
              description: 'Design effective caching strategies and patterns',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Cache Strategy Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        🎨 Advanced Cache Strategy Design &amp; Implementation Patterns
                      </h4>
                      <p className="mb-4">
                        Master the art of designing sophisticated caching strategies that align with your workflow requirements, 
                        data characteristics, and performance goals. Learn proven patterns and advanced techniques used by 
                        high-performance systems to achieve optimal cache effectiveness and reliability.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">🎯 Core Caching Strategies</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">📥 Cache-Aside (Lazy Loading)</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Application explicitly manages cache loading. When data is needed, check cache first, 
                                load from source if missing, then store in cache. Provides fine-grained control but requires careful implementation.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Best For:</strong> Read-heavy workloads with unpredictable access patterns</div>
                                <div><strong>Cache Hit Rate:</strong> 70-85% typical, 90%+ with good key design</div>
                                <div><strong>Complexity:</strong> Medium - requires cache management logic</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">🔄 Write-Through Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Data is written to both cache and backing store simultaneously. Ensures cache consistency 
                                but adds latency to write operations. Ideal for scenarios where data consistency is critical.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Best For:</strong> Applications requiring strong consistency guarantees</div>
                                <div><strong>Performance:</strong> Slower writes, faster reads, high consistency</div>
                                <div><strong>Use Cases:</strong> Financial data, user settings, configuration management</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">⚡ Write-Behind (Write-Back)</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Data written to cache immediately, backing store updated asynchronously. Provides excellent write performance 
                                but introduces complexity around data durability and potential data loss scenarios.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Best For:</strong> High-throughput applications with bursty write patterns</div>
                                <div><strong>Performance:</strong> Very fast writes, complex failure handling</div>
                                <div><strong>Risk:</strong> Potential data loss if cache fails before write-back</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🏗️ Advanced Cache Patterns</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">🔮 Predictive Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Use machine learning and usage patterns to predict what data will be needed next. 
                                Proactively load data into cache before it's requested, reducing apparent latency to near-zero.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Techniques:</strong> User behavior analysis, seasonal patterns, workflow dependencies</div>
                                <div><strong>Benefits:</strong> Sub-millisecond response times, improved user experience</div>
                                <div><strong>Challenges:</strong> Prediction accuracy, cache pollution, computational overhead</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">📚 Multi-Level Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Implement hierarchical cache layers with different characteristics. L1 cache for immediate access, 
                                L2 for broader data sets, L3 for long-term storage with different eviction policies.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>L1 Cache:</strong> Small, fast, frequently accessed data</div>
                                <div><strong>L2 Cache:</strong> Medium size, recent data, moderate access speed</div>
                                <div><strong>L3 Cache:</strong> Large, persistent, infrequently accessed data</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">🎯 Content-Aware Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Adapt caching strategy based on data content characteristics. Different TTL for different data types, 
                                compression for large objects, and specialized handling for binary vs. text data.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Static Data:</strong> Long TTL, aggressive caching</div>
                                <div><strong>Dynamic Data:</strong> Short TTL, selective caching</div>
                                <div><strong>Large Objects:</strong> Compression, chunking, streaming</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🏗️ Strategy Selection Framework</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h6 className="font-medium mb-3 text-blue-600 dark:text-blue-400">📊 Decision Matrix</h6>
                            <div className="space-y-3 text-sm">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                                <h6 className="font-medium text-xs mb-1">High Read, Low Write</h6>
                                <p className="text-xs">Cache-aside with long TTL, read replicas, content delivery networks</p>
                              </div>
                              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded">
                                                                  <h6 className="font-medium text-xs mb-1">High Write, Low Read</h6>
                                <p className="text-xs">Write-behind caching, batch updates, delayed consistency</p>
                              </div>
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded">
                                                                  <h6 className="font-medium text-xs mb-1">Balanced Read/Write</h6>
                                <p className="text-xs">Write-through with intelligent invalidation, hybrid approaches</p>
                              </div>
                              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded">
                                                                  <h6 className="font-medium text-xs mb-1">Real-time Requirements</h6>
                                <p className="text-xs">Minimal caching, cache warming, push-based updates</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="font-medium mb-3 text-green-600 dark:text-green-400">⚖️ Trade-off Analysis</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                <span><strong>Consistency vs Speed:</strong></span>
                                <span className="text-red-600 dark:text-red-400">Choose based on business needs</span>
                              </div>
                              <div className="flex justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                                <span><strong>Memory vs Latency:</strong></span>
                                <span className="text-yellow-600 dark:text-yellow-400">Balance cache size and hit rate</span>
                              </div>
                              <div className="flex justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                <span><strong>Complexity vs Performance:</strong></span>
                                <span className="text-blue-600 dark:text-blue-400">Simple solutions often best</span>
                              </div>
                              <div className="flex justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <span><strong>Cost vs Benefit:</strong></span>
                                <span className="text-green-600 dark:text-green-400">Measure ROI carefully</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎨 Cache Strategy Design Complete!</h4>
                      <p className="mb-4">
                        You've mastered advanced caching strategy design! You can now select and implement optimal 
                        caching patterns for any scenario. Ready to design efficient cache key structures!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Strategy Design</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Key Design</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cache-step-3',
              title: 'Cache Key Design',
              description: 'Design optimal cache key structures',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    {/* Cache Key Design Fundamentals */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🔑 Optimal Cache Key Design &amp; Structure Strategies
                      </h4>
                      <p className="mb-4">
                        Master the critical art of cache key design - the foundation of any effective caching system. 
                        Well-designed keys enable precise cache management, efficient lookups, intelligent invalidation, 
                        and hierarchical organization that scales from simple use cases to complex distributed systems.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Key Design Principles</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🎯 Uniqueness &amp; Precision</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Each cache key must uniquely identify a specific piece of data. Include all parameters 
                                that affect the cached result to prevent cache collisions and ensure data integrity.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Good:</strong> user:123:profile:v2:en-US</div>
                                <div><strong>Bad:</strong> user_profile (ambiguous, collision-prone)</div>
                                <div><strong>Include:</strong> User ID, version, locale, context parameters</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">📊 Hierarchical Organization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Structure keys hierarchically to enable bulk operations, pattern-based invalidation, 
                                and logical grouping. Use consistent delimiters and ordering for predictable behavior.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Pattern:</strong> namespace:entity:id:operation:version</div>
                                <div><strong>Example:</strong> shop:product:456:details:v3</div>
                                <div><strong>Benefits:</strong> Bulk invalidation, namespace isolation, clear organization</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">⚡ Performance Optimization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Design keys for optimal lookup performance. Consider key length, character encoding, 
                                hash distribution, and memory efficiency when designing key structures.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Length:</strong> Keep keys concise but descriptive (under 250 chars)</div>
                                <div><strong>Characters:</strong> Use URL-safe characters, avoid special symbols</div>
                                <div><strong>Distribution:</strong> Ensure even hash distribution across cache nodes</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🏗️ Advanced Key Patterns</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">🔄 Versioned Keys</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Include version information in keys to enable seamless cache updates without invalidation. 
                                Supports gradual rollouts and easy rollbacks while maintaining cache effectiveness.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Schema Version:</strong> api:v2:user:123:profile</div>
                                <div><strong>Data Version:</strong> product:456:details:hash_abc123</div>
                                <div><strong>Time-based:</strong> report:daily:2024-01-15:sales</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">🌍 Context-Aware Keys</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Include contextual information that affects data representation. User preferences, 
                                localization, device types, and feature flags should all influence key structure.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Localization:</strong> content:article:789:en-US:mobile</div>
                                <div><strong>Personalization:</strong> feed:user:123:interests:tech,sports</div>
                                <div><strong>A/B Testing:</strong> ui:component:header:variant_b</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">🎯 Dependency Tracking</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Design keys to reflect data dependencies, enabling intelligent invalidation cascades. 
                                When parent data changes, automatically invalidate all dependent cached data.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Parent-Child:</strong> order:456 → order:456:items, order:456:shipping</div>
                                <div><strong>Aggregations:</strong> stats:daily:2024-01-15 → stats:monthly:2024-01</div>
                                <div><strong>Computed Data:</strong> user:123:permissions → user:123:accessible_features</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🔧 Key Design Implementation Guide</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">1. Naming Convention</h6>
                            <div className="space-y-2 text-sm">
                              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-xs">
                                <strong>Format:</strong> namespace:entity:identifier:operation:context
                              </div>
                              <div>• Use lowercase with underscores or colons</div>
                              <div>• Include version information</div>
                              <div>• Add context when necessary</div>
                              <div>• Maintain consistent ordering</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">2. Hash Strategy</h6>
                            <div className="space-y-2 text-sm">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-xs">
                                <strong>Complex Parameters:</strong> Hash to ensure even distribution
                              </div>
                              <div>• Hash long parameter lists</div>
                              <div>• Include hash version in key</div>
                              <div>• Consider cache node distribution</div>
                              <div>• Avoid hash collisions</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">3. Invalidation Support</h6>
                            <div className="space-y-2 text-sm">
                              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-xs">
                                <strong>Pattern Matching:</strong> Enable wildcard invalidation
                              </div>
                              <div>• Support prefix-based cleanup</div>
                              <div>• Enable tag-based invalidation</div>
                              <div>• Track key relationships</div>
                              <div>• Implement cascade deletion</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔑 Cache Key Design Mastered!</h4>
                      <p className="mb-4">
                        You've mastered optimal cache key design! Your keys will now enable efficient lookups, 
                        intelligent invalidation, and scalable cache management. Ready to implement in-memory caching!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Key Design</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Implementation</span>
                      </div>
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
          description: 'Implement caching mechanisms',
          steps: [
            {
              id: 'cache-step-4',
              title: 'In-Memory Caching',
              description: 'Implement in-memory caching solutions',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        💾 Advanced In-Memory Caching Implementation &amp; Optimization
                      </h4>
                      <p className="mb-4">
                        Master high-performance in-memory caching systems that deliver microsecond response times and 
                        dramatically improve workflow performance. Learn to implement sophisticated memory management, 
                        eviction policies, and optimization techniques for maximum cache effectiveness.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🎯 Memory Cache Types</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">⚡ Simple Object Cache</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Basic JavaScript Map or Object-based cache for small to medium datasets. 
                                Provides fastest access times but requires manual memory management and size limitations.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Performance:</strong> 0.001-0.01ms access time</div>
                                <div><strong>Capacity:</strong> Limited by Node.js heap size</div>
                                <div><strong>Best For:</strong> Frequently accessed small data, configuration, lookup tables</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">🧠 LRU Cache Implementation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Least Recently Used cache with automatic eviction and size management. 
                                Maintains optimal memory usage while preserving frequently accessed data for maximum hit rates.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Features:</strong> Automatic eviction, size limits, access tracking</div>
                                <div><strong>Hit Rate:</strong> 85-95% for well-tuned configurations</div>
                                <div><strong>Memory Management:</strong> Predictable memory usage with upper bounds</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">⏰ TTL-Based Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Time-To-Live cache that automatically expires data after specified intervals. 
                                Perfect for data with known freshness requirements and predictable update patterns.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Expiration:</strong> Automatic cleanup based on time</div>
                                <div><strong>Flexibility:</strong> Per-key TTL configuration</div>
                                <div><strong>Use Cases:</strong> API responses, computed results, session data</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🔧 Advanced Features</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">📊 Multi-Tier Memory Management</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Implement hierarchical memory caching with multiple tiers optimized for different access patterns. 
                                Hot data in fast memory, warm data in larger slower memory, with intelligent promotion/demotion.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>L1 Cache:</strong> Small (1-10MB), ultra-fast access, critical data</div>
                                <div><strong>L2 Cache:</strong> Medium (50-200MB), fast access, frequently used data</div>
                                <div><strong>L3 Cache:</strong> Large (500MB+), slower access, infrequently used data</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🔄 Intelligent Prefetching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Predict and preload data before it's requested based on access patterns, user behavior, 
                                and workflow dependencies. Reduces perceived latency to near-zero for predictable access patterns.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Pattern Recognition:</strong> Learn from historical access patterns</div>
                                <div><strong>Dependency Graphs:</strong> Preload related data automatically</div>
                                <div><strong>User Behavior:</strong> Predict next actions based on current context</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">⚡ Compression &amp; Serialization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Optimize memory usage through intelligent compression and efficient serialization. 
                                Balance compression ratio vs. CPU overhead to maximize effective cache capacity.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Text Data:</strong> gzip compression for JSON/XML (60-80% reduction)</div>
                                <div><strong>Binary Data:</strong> Specialized algorithms based on data type</div>
                                <div><strong>Smart Compression:</strong> Compress only when beneficial</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">💾 In-Memory Caching Implemented!</h4>
                      <p className="mb-4">You've implemented high-performance in-memory caching! Ready for distributed caching systems!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cache-step-5',
              title: 'Distributed Caching',
              description: 'Set up distributed caching systems',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🌐 Enterprise Distributed Caching Architecture &amp; Implementation
                      </h4>
                      <p className="mb-4">
                        Master distributed caching systems that scale across multiple servers, regions, and data centers. 
                        Learn to implement Redis clusters, Memcached networks, and hybrid caching architectures that 
                        provide enterprise-grade performance, reliability, and global data consistency.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎯 Distributed Cache Types</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">🔴 Redis Cluster Implementation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                High-performance distributed Redis setup with automatic sharding, replication, and failover. 
                                Provides data persistence, pub/sub messaging, and advanced data structures for complex caching scenarios.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Performance:</strong> 100,000+ ops/sec per node</div>
                                <div><strong>Capacity:</strong> Petabyte-scale with proper sharding</div>
                                <div><strong>Features:</strong> Persistence, replication, complex data types</div>
                                <div><strong>Use Cases:</strong> Session storage, real-time analytics, message queuing</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">⚡ Memcached Network</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Simple, fast distributed memory caching system optimized for high-throughput, low-latency scenarios. 
                                Perfect for read-heavy workloads with simple key-value data that doesn't require persistence.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Performance:</strong> Sub-millisecond latency, 1M+ ops/sec</div>
                                <div><strong>Simplicity:</strong> Minimal configuration, easy scaling</div>
                                <div><strong>Memory Efficiency:</strong> Optimized for maximum throughput</div>
                                <div><strong>Best For:</strong> Web page caching, API response caching, object storage</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🔗 Hybrid Cache Architecture</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Multi-tier distributed caching combining in-memory, Redis, and CDN layers. 
                                Optimizes for different data types and access patterns while maintaining consistency across tiers.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>L1:</strong> Local in-memory cache for ultra-fast access</div>
                                <div><strong>L2:</strong> Redis cluster for shared cache across instances</div>
                                <div><strong>L3:</strong> CDN/Edge cache for global content distribution</div>
                                <div><strong>Benefits:</strong> Optimal performance at every layer</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🏗️ Architecture Patterns</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">🔄 Cache-Aside Pattern</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Application manages cache population and invalidation explicitly. Provides maximum control 
                                over caching behavior but requires careful implementation to maintain consistency.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Read:</strong> Check cache → Miss → Load from DB → Store in cache</div>
                                <div><strong>Write:</strong> Update DB → Invalidate cache entry</div>
                                <div><strong>Benefits:</strong> Fine-grained control, fault tolerance</div>
                                <div><strong>Challenges:</strong> Cache-DB consistency, complex invalidation</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">🌊 Write-Through Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Data written simultaneously to cache and database, ensuring strong consistency. 
                                Adds write latency but eliminates cache-database inconsistency issues.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Write Path:</strong> App → Cache → Database (synchronous)</div>
                                <div><strong>Consistency:</strong> Strong consistency guaranteed</div>
                                <div><strong>Performance:</strong> Slower writes, faster reads</div>
                                <div><strong>Use Cases:</strong> Financial data, user settings, critical information</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">⚡ Write-Behind Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Data written to cache immediately, database updated asynchronously. 
                                Provides excellent write performance but requires careful handling of potential data loss scenarios.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Write Path:</strong> App → Cache (immediate) → Database (delayed)</div>
                                <div><strong>Performance:</strong> Very fast writes, complex failure handling</div>
                                <div><strong>Risk Management:</strong> Persistence guarantees, retry mechanisms</div>
                                <div><strong>Best For:</strong> High-throughput logging, analytics, batch processing</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🌐 Distributed Caching Active!</h4>
                      <p className="mb-4">You've implemented enterprise-grade distributed caching! Ready for intelligent cache invalidation!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cache-step-6',
              title: 'Cache Invalidation',
              description: 'Implement intelligent cache invalidation strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-amber-600 dark:text-amber-400">
                        🔄 Intelligent Cache Invalidation &amp; Consistency Management
                      </h4>
                      <p className="mb-4">
                        Master the most challenging aspect of caching: intelligent invalidation strategies that maintain 
                        data consistency while preserving cache effectiveness. Learn advanced techniques for dependency tracking, 
                        cascade invalidation, and real-time consistency across distributed cache networks.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">🎯 Invalidation Strategies</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">⏰ Time-Based Invalidation (TTL)</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Automatic expiration based on configurable time intervals. Simple to implement but may serve stale data 
                                or invalidate fresh data prematurely. Best for data with predictable update patterns.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Implementation:</strong> Set expiration timestamp with each cache entry</div>
                                <div><strong>Pros:</strong> Simple, predictable, no external dependencies</div>
                                <div><strong>Cons:</strong> May serve stale data, premature invalidation</div>
                                <div><strong>Best For:</strong> API responses, reports, computed aggregations</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🎯 Event-Driven Invalidation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Invalidate cache entries immediately when underlying data changes. Provides strong consistency 
                                but requires robust event delivery and handling of complex dependency relationships.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Triggers:</strong> Database changes, API updates, user actions</div>
                                <div><strong>Delivery:</strong> Message queues, webhooks, database triggers</div>
                                <div><strong>Benefits:</strong> Strong consistency, optimal cache utilization</div>
                                <div><strong>Complexity:</strong> Event delivery guarantees, dependency tracking</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">🔄 Version-Based Invalidation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Use version numbers or checksums to detect data changes. Cache entries include version information, 
                                and mismatches trigger automatic refresh. Excellent for eventually consistent systems.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Version Types:</strong> Timestamps, sequence numbers, content hashes</div>
                                <div><strong>Validation:</strong> Compare cache version with source version</div>
                                <div><strong>Benefits:</strong> Precise invalidation, conflict detection</div>
                                <div><strong>Use Cases:</strong> Document systems, configuration management</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🏗️ Advanced Patterns</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">🌊 Cascade Invalidation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Automatically invalidate dependent cache entries when parent data changes. Build dependency graphs 
                                to track relationships and propagate invalidation through the entire dependency chain.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Example:</strong> User profile change → invalidate user cache, session cache, permissions cache</div>
                                <div><strong>Implementation:</strong> Dependency graphs, tag-based grouping</div>
                                <div><strong>Benefits:</strong> Maintains consistency across related data</div>
                                <div><strong>Challenges:</strong> Circular dependencies, performance impact</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">🏷️ Tag-Based Invalidation</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Associate cache entries with tags representing data categories or business entities. 
                                Invalidate all entries with specific tags when related data changes, enabling bulk operations.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Tagging:</strong> user:123, product:category:electronics, region:us-west</div>
                                <div><strong>Bulk Operations:</strong> Invalidate all entries with specific tags</div>
                                <div><strong>Flexibility:</strong> Multiple tags per entry, hierarchical tags</div>
                                <div><strong>Performance:</strong> Efficient bulk invalidation operations</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">🔄 Refresh-Ahead Caching</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Proactively refresh cache entries before they expire, ensuring users always receive fresh data 
                                without waiting for cache misses. Requires background processing and careful timing management.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Strategy:</strong> Refresh when 70-80% of TTL has elapsed</div>
                                <div><strong>Benefits:</strong> Zero-downtime updates, consistent performance</div>
                                <div><strong>Requirements:</strong> Background workers, load monitoring</div>
                                <div><strong>Optimization:</strong> Priority-based refresh scheduling</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔄 Cache Invalidation Mastered!</h4>
                      <p className="mb-4">You've conquered intelligent cache invalidation! Ready to optimize cache hit rates and performance!</p>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🎯 Advanced Cache Hit Rate Optimization &amp; Performance Tuning
                      </h4>
                      <p className="mb-4">
                        Master sophisticated techniques to maximize cache hit rates and optimize cache performance. 
                        Learn data-driven optimization strategies, predictive caching algorithms, and advanced tuning 
                        methods that achieve 95%+ hit rates and microsecond response times in production systems.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📊 Hit Rate Optimization Strategies</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-emerald-600 dark:text-emerald-400">🔮 Predictive Preloading</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Use machine learning and pattern analysis to predict what data will be needed next. 
                                Preload cache with high-probability requests before users actually make them, achieving near-zero latency.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Techniques:</strong> Collaborative filtering, sequence prediction, session analysis</div>
                                <div><strong>Accuracy:</strong> 80-90% prediction accuracy with proper training</div>
                                <div><strong>Impact:</strong> Perceived latency reduction of 60-90%</div>
                                <div><strong>Requirements:</strong> Historical data, ML pipeline, continuous learning</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🌊 Warm-up Strategies</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Systematically populate cache with essential data during low-traffic periods. 
                                Ensure critical paths are always cached when users need them most, preventing cold start performance issues.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Schedule:</strong> Pre-populate during maintenance windows</div>
                                <div><strong>Priority:</strong> Most frequently accessed data first</div>
                                <div><strong>Validation:</strong> Verify data freshness before caching</div>
                                <div><strong>Automation:</strong> Triggered by deployments, data updates</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">🎯 Adaptive Cache Sizing</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Dynamically adjust cache size based on workload patterns, memory availability, and hit rate metrics. 
                                Optimize the balance between memory usage and cache effectiveness in real-time.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Metrics:</strong> Hit rate, memory pressure, request patterns</div>
                                <div><strong>Scaling:</strong> Automatic size adjustment based on performance</div>
                                <div><strong>Algorithms:</strong> Gradient descent, reinforcement learning</div>
                                <div><strong>Constraints:</strong> Memory limits, latency requirements</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚡ Performance Optimization Techniques</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">🚀 Access Pattern Optimization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Analyze and optimize data access patterns to improve cache locality and reduce miss penalties. 
                                Reorganize data structures and access sequences for maximum cache efficiency.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Analysis:</strong> Heat maps, access frequency, temporal patterns</div>
                                <div><strong>Optimization:</strong> Data co-location, prefetch ordering</div>
                                <div><strong>Benefits:</strong> 40-60% improvement in effective hit rate</div>
                                <div><strong>Tools:</strong> Profiling, access tracking, visualization</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">🔄 Multi-Level Hit Optimization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Implement sophisticated multi-tier caching with optimized promotion/demotion algorithms. 
                                Balance between cache levels to maximize overall hit rate across the entire cache hierarchy.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>L1 Strategy:</strong> Highest frequency data, immediate access</div>
                                <div><strong>L2 Strategy:</strong> Recent data, fast promotion from L3</div>
                                <div><strong>L3 Strategy:</strong> Long-term storage, intelligent eviction</div>
                                <div><strong>Coordination:</strong> Inter-level optimization algorithms</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">📈 Continuous Optimization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Implement feedback loops that continuously monitor and adjust cache parameters. 
                                Use A/B testing and machine learning to optimize cache configuration for changing workloads.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Monitoring:</strong> Real-time performance metrics</div>
                                <div><strong>Testing:</strong> A/B test different configurations</div>
                                <div><strong>Learning:</strong> Automated parameter tuning</div>
                                <div><strong>Adaptation:</strong> Dynamic configuration updates</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Cache Hit Optimization Complete!</h4>
                      <p className="mb-4">You've mastered cache hit optimization! Ready for advanced memory management!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cache-step-8',
              title: 'Memory Management',
              description: 'Optimize cache memory usage and eviction',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🧠 Advanced Cache Memory Management &amp; Eviction Optimization
                      </h4>
                      <p className="mb-4">
                        Master sophisticated memory management techniques for optimal cache performance. 
                        Learn advanced eviction algorithms, memory optimization strategies, and intelligent 
                        resource allocation that maximizes cache effectiveness while preventing memory exhaustion.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Advanced Eviction Algorithms</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-violet-600 dark:text-violet-400">🧮 Adaptive Replacement Cache (ARC)</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Intelligent algorithm that adapts between recency and frequency-based eviction. 
                                Dynamically balances LRU and LFU strategies based on workload characteristics for optimal performance.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Adaptation:</strong> Continuously learns optimal LRU/LFU balance</div>
                                <div><strong>Performance:</strong> 15-25% better hit rate than pure LRU</div>
                                <div><strong>Complexity:</strong> Higher overhead but superior adaptability</div>
                                <div><strong>Best For:</strong> Mixed workloads with varying access patterns</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">⚡ Clock-Pro Algorithm</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Low-overhead approximation of optimal caching that considers both recency and frequency. 
                                Provides near-optimal performance with minimal computational cost and memory overhead.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Efficiency:</strong> O(1) operations with minimal metadata</div>
                                <div><strong>Accuracy:</strong> Close to optimal replacement decisions</div>
                                <div><strong>Overhead:</strong> Very low memory and CPU requirements</div>
                                <div><strong>Use Cases:</strong> High-throughput systems, memory-constrained environments</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🎯 Multi-Queue (MQ) Eviction</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Segregate cache entries into multiple queues based on access frequency. 
                                Provides fine-grained control over eviction priorities and excellent performance for skewed access patterns.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Queues:</strong> Hot, warm, cold data with different eviction policies</div>
                                <div><strong>Promotion:</strong> Move entries between queues based on access</div>
                                <div><strong>Benefits:</strong> Excellent for Zipfian distributions</div>
                                <div><strong>Tuning:</strong> Queue sizes and promotion thresholds configurable</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🔧 Memory Optimization Strategies</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">📦 Intelligent Compression</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Apply contextual compression strategies based on data type, size, and access patterns. 
                                Balance compression ratio against CPU overhead to maximize effective cache capacity.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Text Data:</strong> LZ4 for speed, Gzip for ratio (60-80% reduction)</div>
                                <div><strong>JSON/XML:</strong> Schema-aware compression (70-90% reduction)</div>
                                <div><strong>Binary Data:</strong> Domain-specific algorithms based on content</div>
                                <div><strong>Adaptive:</strong> Choose compression based on size/access frequency</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-cyan-600 dark:text-cyan-400">🔄 Memory Pool Management</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Implement sophisticated memory pool allocation to reduce fragmentation and improve performance. 
                                Use size-based pools and intelligent allocation strategies for optimal memory utilization.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Pool Types:</strong> Small (64B-1KB), Medium (1KB-64KB), Large (64KB+)</div>
                                <div><strong>Allocation:</strong> Best-fit algorithms with defragmentation</div>
                                <div><strong>Benefits:</strong> Reduced fragmentation, consistent performance</div>
                                <div><strong>Monitoring:</strong> Pool utilization and fragmentation metrics</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">📊 Predictive Memory Management</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Use machine learning to predict memory usage patterns and proactively manage cache allocation. 
                                Prevent memory pressure before it impacts performance through intelligent resource planning.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Prediction:</strong> Memory usage forecasting based on historical patterns</div>
                                <div><strong>Allocation:</strong> Dynamic cache size adjustment</div>
                                <div><strong>Prevention:</strong> Proactive eviction before memory pressure</div>
                                <div><strong>Learning:</strong> Continuous model improvement based on actual usage</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🧠 Memory Management Optimized!</h4>
                      <p className="mb-4">You've mastered advanced memory management! Ready for comprehensive cache monitoring!</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cache-step-9',
              title: 'Cache Monitoring',
              description: 'Monitor cache performance and effectiveness',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                        📊 Comprehensive Cache Monitoring &amp; Performance Analytics
                      </h4>
                      <p className="mb-4">
                        Master advanced cache monitoring and analytics to maintain optimal performance and identify 
                        optimization opportunities. Learn to implement comprehensive metrics collection, real-time alerting, 
                        and sophisticated analysis techniques that ensure your caching systems operate at peak efficiency.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">📈 Essential Metrics &amp; KPIs</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🎯 Hit Rate Analytics</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Track cache hit rates across different dimensions to identify patterns and optimization opportunities. 
                                Monitor overall, per-key-pattern, and temporal hit rates for comprehensive performance visibility.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Overall Hit Rate:</strong> Total hits / (hits + misses) - Target: 85-95%</div>
                                <div><strong>Per-Pattern Analysis:</strong> Hit rates by key patterns and data types</div>
                                <div><strong>Temporal Patterns:</strong> Hit rate variations by time of day, week</div>
                                <div><strong>Cohort Analysis:</strong> Hit rates for different user segments</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">⚡ Performance Metrics</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Monitor response times, throughput, and resource utilization to ensure optimal cache performance. 
                                Track both average and percentile metrics for comprehensive performance understanding.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Response Time:</strong> P50, P95, P99 latencies for hits and misses</div>
                                <div><strong>Throughput:</strong> Operations per second, data transfer rates</div>
                                <div><strong>Resource Usage:</strong> CPU, memory, network utilization</div>
                                <div><strong>Error Rates:</strong> Connection failures, timeouts, corrupted data</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">💾 Memory &amp; Storage Metrics</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Track memory usage, eviction rates, and storage efficiency to optimize cache capacity and prevent performance degradation from memory pressure.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Memory Usage:</strong> Used vs. available, growth trends</div>
                                <div><strong>Eviction Rate:</strong> Premature evictions, eviction reasons</div>
                                <div><strong>Fragmentation:</strong> Memory fragmentation levels</div>
                                <div><strong>Compression Ratio:</strong> Space savings from compression</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🔍 Advanced Analytics &amp; Alerting</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">🚨 Intelligent Alerting</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Implement smart alerting systems that detect anomalies and performance degradation before they impact users. 
                                Use machine learning for adaptive thresholds and reduce false positive alerts.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Anomaly Detection:</strong> ML-based detection of unusual patterns</div>
                                <div><strong>Adaptive Thresholds:</strong> Dynamic limits based on historical data</div>
                                <div><strong>Severity Levels:</strong> Critical, warning, info with appropriate routing</div>
                                <div><strong>Context-Aware:</strong> Alerts include relevant diagnostic information</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">📊 Predictive Analytics</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Use historical data and machine learning to predict future cache performance and capacity needs. 
                                Enable proactive optimization and capacity planning for sustained high performance.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Capacity Planning:</strong> Predict when cache will reach capacity limits</div>
                                <div><strong>Performance Forecasting:</strong> Expected hit rates under different scenarios</div>
                                <div><strong>Trend Analysis:</strong> Long-term performance and usage trends</div>
                                <div><strong>Optimization Recommendations:</strong> Data-driven suggestions for improvements</div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">🎯 Business Impact Tracking</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Connect cache performance metrics to business outcomes and user experience indicators. 
                                Demonstrate the value of caching optimization through concrete business impact measurements.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>User Experience:</strong> Page load times, conversion rates</div>
                                <div><strong>Cost Savings:</strong> Reduced API calls, lower infrastructure costs</div>
                                <div><strong>Scalability:</strong> Supported concurrent users, peak load handling</div>
                                <div><strong>ROI Tracking:</strong> Cost of caching vs. performance benefits</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎉 Complete Caching Mastery Achieved!</h4>
                      <p className="mb-4">
                        Congratulations! You've mastered the complete caching optimization pipeline: analysis, strategy design, 
                        key design, in-memory caching, distributed caching, invalidation, hit optimization, memory management, 
                        and comprehensive monitoring. Your n8n workflows now feature enterprise-grade caching systems that 
                        deliver exceptional performance, scalability, and reliability!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Cache Monitoring</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🏆 Complete Caching Mastery</span>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        📊 Advanced Schedule Analysis &amp; Optimization Framework
                      </h4>
                      <p className="mb-4">
                        Master comprehensive schedule analysis to identify execution patterns, resource utilization, 
                        and optimization opportunities. Learn to analyze workflow timing, detect bottlenecks, 
                        and design optimal scheduling strategies for maximum efficiency and reliability.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📈 Execution Pattern Analysis</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Peak Hour Identification:</strong> Determine highest usage periods and resource demands</div>
                            <div><strong>Frequency Distribution:</strong> Analyze execution frequency patterns and timing variations</div>
                            <div><strong>Duration Tracking:</strong> Monitor execution times and identify slow operations</div>
                            <div><strong>Success Rate Analysis:</strong> Track completion rates and failure patterns by time</div>
                            <div><strong>Resource Usage Correlation:</strong> Connect execution patterns to resource consumption</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Optimization Opportunities</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Schedule Spreading:</strong> Distribute load across available time windows</div>
                            <div><strong>Batch Processing:</strong> Group related operations for efficiency gains</div>
                            <div><strong>Off-Peak Migration:</strong> Move non-critical tasks to low-usage periods</div>
                            <div><strong>Dependency Optimization:</strong> Reorganize workflows to reduce wait times</div>
                            <div><strong>Resource Alignment:</strong> Match execution timing to resource availability</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">🔍 Step-by-Step Analysis Process</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Data Collection (5 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Gather comprehensive execution data from your n8n instance to establish a baseline for analysis.</p>
                              <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded text-xs font-mono">
                                <div className="mb-2 font-bold">Access execution data:</div>
                                <div>• Navigate to Settings → Log streaming</div>
                                <div>• Export execution history (last 30 days)</div>
                                <div>• Download workflow execution logs</div>
                                <div>• Extract timing and resource metrics</div>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">💡 Tip: Use the n8n API to programmatically collect execution data for automated analysis</p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Pattern Identification (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Analyze the collected data to identify execution patterns, peak periods, and resource usage trends.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded">
                                  <div className="font-medium mb-2 text-xs">Time-based Analysis:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Hourly execution counts</div>
                                    <div>• Daily execution patterns</div>
                                    <div>• Weekly trends and cycles</div>
                                    <div>• Monthly seasonality</div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded">
                                  <div className="font-medium mb-2 text-xs">Performance Metrics:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Average execution time</div>
                                    <div>• Success/failure rates</div>
                                    <div>• Resource consumption</div>
                                    <div>• Queue wait times</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Bottleneck Detection (7 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Identify specific bottlenecks and optimization opportunities in your scheduling patterns.</p>
                              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-red-600 dark:text-red-400 text-xs">Common Bottlenecks to Look For:</div>
                                <div className="text-xs space-y-1">
                                  <div>🚫 <strong>Concurrent execution limits:</strong> Too many workflows running simultaneously</div>
                                  <div>🚫 <strong>Resource contention:</strong> Multiple workflows competing for same resources</div>
                                  <div>🚫 <strong>Peak hour overload:</strong> All workflows scheduled at same time</div>
                                  <div>🚫 <strong>Dependency chains:</strong> Workflows waiting for others to complete</div>
                                  <div>🚫 <strong>Inefficient triggers:</strong> Overly frequent polling or webhook overload</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Optimization Indicators:</div>
                                <div className="text-xs space-y-1">
                                  <div>✅ <strong>Off-peak capacity:</strong> Unused execution windows available</div>
                                  <div>✅ <strong>Batch opportunities:</strong> Similar workflows that could be grouped</div>
                                  <div>✅ <strong>Parallel potential:</strong> Independent workflows that could run simultaneously</div>
                                  <div>✅ <strong>Schedule gaps:</strong> Time periods with low resource utilization</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Analysis Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Data Collection ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Exported 30-day execution history</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Collected resource usage metrics</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Documented current scheduling patterns</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Identified peak and off-peak periods</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Analysis Complete ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Found execution bottlenecks</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Identified optimization opportunities</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Calculated potential performance gains</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Created improvement action plan</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: E-commerce Workflow Analysis</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Scenario:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              An e-commerce company has 15 workflows running: inventory sync (every 30 min), order processing (on webhook), 
                              daily reports (8 AM), customer emails (hourly), and price monitoring (every 15 min).
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-red-600 dark:text-red-400">Problems Found:</h6>
                            <div className="text-xs space-y-1">
                              <div>• All daily reports start at 8:00 AM causing CPU spike</div>
                              <div>• Order processing sometimes delays during inventory sync</div>
                              <div>• Customer email queue backs up during peak hours (2-4 PM)</div>
                              <div>• Price monitoring conflicts with inventory sync causing failures</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Solutions Implemented:</h6>
                            <div className="text-xs space-y-1">
                              <div>• Staggered daily reports: 8:00, 8:15, 8:30, 8:45 AM</div>
                              <div>• Added priority queues for order processing</div>
                              <div>• Moved customer emails to off-peak hours (6-8 AM, 10-12 PM)</div>
                              <div>• Synchronized price monitoring with inventory sync schedule</div>
                              <div>• Result: 40% reduction in execution time, 95% fewer conflicts</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-2',
              title: 'Trigger Optimization',
              description: 'Optimize workflow triggers and scheduling frequency',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        ⚡ Advanced Trigger Optimization &amp; Efficiency Enhancement
                      </h4>
                      <p className="mb-4">
                        Master trigger optimization techniques to minimize execution overhead, reduce resource consumption, 
                        and maximize workflow efficiency. Learn to configure triggers for optimal performance while 
                        maintaining reliability and responsiveness to changing conditions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">🎯 Trigger Types &amp; Optimization</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Webhook Triggers:</strong> Optimize for high-frequency, low-latency event processing</div>
                            <div><strong>Polling Triggers:</strong> Balance frequency vs. resource usage for data monitoring</div>
                            <div><strong>Schedule Triggers:</strong> Implement intelligent timing and load distribution</div>
                            <div><strong>Manual Triggers:</strong> Optimize for rapid user-initiated workflow execution</div>
                            <div><strong>File System Triggers:</strong> Efficient monitoring with minimal resource overhead</div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">⚙️ Performance Techniques</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Batching Strategy:</strong> Group multiple triggers for efficient processing</div>
                            <div><strong>Rate Limiting:</strong> Prevent trigger overload and resource exhaustion</div>
                            <div><strong>Conditional Logic:</strong> Add intelligent filtering to reduce unnecessary executions</div>
                            <div><strong>Debouncing:</strong> Prevent rapid-fire triggers from overwhelming the system</div>
                            <div><strong>Circuit Breakers:</strong> Implement failure protection and auto-recovery</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">🔧 Step-by-Step Trigger Optimization</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Trigger Audit (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Analyze all current triggers to identify inefficiencies and optimization opportunities.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded">
                                  <div className="font-medium mb-2 text-xs">Webhook Triggers Analysis:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Check for duplicate webhooks</div>
                                    <div>• Monitor webhook response times</div>
                                    <div>• Verify SSL certificate validity</div>
                                    <div>• Test webhook reliability</div>
                                    <div>• Optimize webhook authentication</div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded">
                                  <div className="font-medium mb-2 text-xs">Polling Triggers Review:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Document polling frequencies</div>
                                    <div>• Calculate resource overhead</div>
                                    <div>• Check for unnecessary polls</div>
                                    <div>• Analyze response patterns</div>
                                    <div>• Identify batch opportunities</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔍 Audit Command:</strong> Use n8n CLI to export trigger configurations:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">n8n export:workflow --output=triggers-audit.json</code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Frequency Optimization (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Optimize trigger frequencies based on actual data change patterns and business requirements.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Frequency Optimization Matrix:</div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-xs">
                                    <thead className="bg-gray-100 dark:bg-gray-600">
                                      <tr>
                                        <th className="px-2 py-1 text-left">Data Change Frequency</th>
                                        <th className="px-2 py-1 text-left">Business Criticality</th>
                                        <th className="px-2 py-1 text-left">Recommended Trigger</th>
                                        <th className="px-2 py-1 text-left">Polling Interval</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                      <tr>
                                        <td className="px-2 py-1">Real-time</td>
                                        <td className="px-2 py-1">Critical</td>
                                        <td className="px-2 py-1">Webhook</td>
                                        <td className="px-2 py-1">Immediate</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1">Frequent (minutes)</td>
                                        <td className="px-2 py-1">High</td>
                                        <td className="px-2 py-1">Polling</td>
                                        <td className="px-2 py-1">2-5 minutes</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1">Hourly</td>
                                        <td className="px-2 py-1">Medium</td>
                                        <td className="px-2 py-1">Schedule</td>
                                        <td className="px-2 py-1">15-30 minutes</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1">Daily</td>
                                        <td className="px-2 py-1">Low</td>
                                        <td className="px-2 py-1">Schedule</td>
                                        <td className="px-2 py-1">2-6 hours</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>💡 Smart Frequency Tips:</strong><br/>
                                  • Use exponential backoff for failing triggers<br/>
                                  • Implement jitter to prevent thundering herd<br/>
                                  • Consider time zones for global workflows<br/>
                                  • Monitor trigger success rates over time
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Advanced Trigger Patterns (7 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement advanced trigger patterns for maximum efficiency and reliability.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Batching Pattern:</div>
                                  <div className="text-xs space-y-1">
                                    <div><strong>Problem:</strong> 100 individual file processing triggers</div>
                                    <div><strong>Solution:</strong> Batch trigger every 5 minutes</div>
                                    <div><strong>Result:</strong> 95% reduction in overhead</div>
                                    <div><strong>Implementation:</strong></div>
                                    <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono">
                                      Poll for files → Batch by type → Process groups
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Conditional Trigger:</div>
                                  <div className="text-xs space-y-1">
                                    <div><strong>Problem:</strong> API polling returns empty 80% of time</div>
                                    <div><strong>Solution:</strong> Add data change detection</div>
                                    <div><strong>Result:</strong> 80% reduction in executions</div>
                                    <div><strong>Implementation:</strong></div>
                                    <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono">
                                      IF data.hash !== last_hash → Process
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>⚠️ Common Trigger Mistakes to Avoid:</strong><br/>
                                  • Setting polling too frequent for slow-changing data<br/>
                                  • Using webhooks without proper error handling<br/>
                                  • Not implementing rate limiting on external APIs<br/>
                                  • Missing retry logic for transient failures<br/>
                                  • Ignoring trigger authentication security
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">📋 Trigger Optimization Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Webhook Optimization ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented proper error handling</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added authentication & validation</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured retry logic</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up monitoring alerts</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Polling Optimization ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Optimized polling frequencies</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added conditional logic</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented batching where possible</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up rate limiting</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Schedule Optimization ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Staggered execution times</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Optimized for time zones</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added business hour logic</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented holiday handling</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: SaaS Integration Optimization</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Before Optimization:</h6>
                            <div className="text-xs space-y-1">
                              <div>• 50 separate API polling triggers every 30 seconds</div>
                              <div>• Webhooks failing 20% of the time without retries</div>
                              <div>• Daily reports all triggered at 9:00 AM causing overload</div>
                              <div>• No conditional logic - processing empty responses</div>
                              <div>• Monthly API costs: $1,200, High server load</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">After Optimization:</h6>
                            <div className="text-xs space-y-1">
                              <div>• Consolidated to 10 batched triggers every 5 minutes</div>
                              <div>• Added exponential backoff retry logic to webhooks</div>
                              <div>• Staggered daily reports across 9:00-10:00 AM window</div>
                              <div>• Implemented data change detection (hash comparison)</div>
                              <div>• Monthly API costs: $300, 70% reduction in server load</div>
                              <div>• 95% improvement in reliability, 60% faster processing</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-3',
              title: 'Queue Management',
              description: 'Implement efficient queue management strategies',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🎛️ Advanced Queue Management &amp; Processing Optimization
                      </h4>
                      <p className="mb-4">
                        Master sophisticated queue management techniques to optimize workflow execution, prevent bottlenecks, 
                        and ensure reliable processing under high load. Learn advanced patterns for priority handling, 
                        load balancing, and fault tolerance in complex automation systems.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🚀 Queue Architectures</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>FIFO Queues:</strong> Simple ordered processing for sequential workflows</div>
                            <div><strong>Priority Queues:</strong> Dynamic processing based on importance and deadlines</div>
                            <div><strong>Dead Letter Queues:</strong> Handle failed messages with retry logic and monitoring</div>
                            <div><strong>Delay Queues:</strong> Schedule future processing with precise timing control</div>
                            <div><strong>Fan-out Queues:</strong> Parallel processing across multiple worker instances</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">⚙️ Optimization Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Batch Processing:</strong> Group related tasks for efficiency improvements</div>
                            <div><strong>Auto-scaling:</strong> Dynamic worker adjustment based on queue depth</div>
                            <div><strong>Circuit Breakers:</strong> Prevent cascade failures with intelligent fallbacks</div>
                            <div><strong>Rate Limiting:</strong> Control processing speed to prevent resource overload</div>
                            <div><strong>Health Monitoring:</strong> Real-time tracking of queue performance and health</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🔧 Step-by-Step Queue Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Queue Architecture Design (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Design the optimal queue architecture based on your workflow patterns and requirements.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Queue Type Selection:</div>
                                  <div className="text-xs space-y-1">
                                    <div><strong>Simple FIFO:</strong> Basic workflows, predictable order</div>
                                    <div><strong>Priority Queue:</strong> Mixed criticality levels</div>
                                    <div><strong>Topic-based:</strong> Different workflow categories</div>
                                    <div><strong>Sharded Queues:</strong> High-volume processing</div>
                                    <div><strong>Dead Letter:</strong> Error handling and recovery</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Design Considerations:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Expected message volume per hour</div>
                                    <div>• Message size and processing time</div>
                                    <div>• Priority levels and SLA requirements</div>
                                    <div>• Fault tolerance and retry needs</div>
                                    <div>• Scaling and performance requirements</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🏗️ n8n Queue Configuration:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    Settings → Execution → Queue Mode → Bull Queue Settings
                                  </code><br/>
                                  Configure Redis connection and queue parameters for optimal performance.
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Priority Implementation (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Configure priority levels and processing rules for different workflow types.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Priority Level Configuration:</div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-xs">
                                    <thead className="bg-gray-100 dark:bg-gray-600">
                                      <tr>
                                        <th className="px-2 py-1 text-left">Priority</th>
                                        <th className="px-2 py-1 text-left">Value</th>
                                        <th className="px-2 py-1 text-left">Use Case</th>
                                        <th className="px-2 py-1 text-left">SLA Target</th>
                                        <th className="px-2 py-1 text-left">Worker Ratio</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                      <tr>
                                        <td className="px-2 py-1 text-red-600 font-medium">Critical</td>
                                        <td className="px-2 py-1">10</td>
                                        <td className="px-2 py-1">Security alerts, payments</td>
                                        <td className="px-2 py-1">&lt; 30 seconds</td>
                                        <td className="px-2 py-1">40%</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1 text-orange-600 font-medium">High</td>
                                        <td className="px-2 py-1">7</td>
                                        <td className="px-2 py-1">User requests, notifications</td>
                                        <td className="px-2 py-1">&lt; 2 minutes</td>
                                        <td className="px-2 py-1">35%</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1 text-yellow-600 font-medium">Normal</td>
                                        <td className="px-2 py-1">5</td>
                                        <td className="px-2 py-1">Regular automation</td>
                                        <td className="px-2 py-1">&lt; 10 minutes</td>
                                        <td className="px-2 py-1">20%</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1 text-blue-600 font-medium">Low</td>
                                        <td className="px-2 py-1">1</td>
                                        <td className="px-2 py-1">Reports, cleanup</td>
                                        <td className="px-2 py-1">&lt; 1 hour</td>
                                        <td className="px-2 py-1">5%</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>⚙️ Implementation Example:</strong><br/>
                                  Add priority to workflow settings using the webhook node's advanced options:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{"{{$json.priority || 5}}"}</code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Dead Letter Queue Setup (12 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Configure error handling and recovery mechanisms for failed workflow executions.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-red-600 dark:text-red-400 text-xs">Failure Scenarios:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Network timeouts and API failures</div>
                                    <div>• Invalid data format or structure</div>
                                    <div>• Resource exhaustion (memory/CPU)</div>
                                    <div>• Authentication and permission errors</div>
                                    <div>• Dependency service unavailability</div>
                                  </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Recovery Strategies:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Exponential backoff retry logic</div>
                                    <div>• Manual review and reprocessing</div>
                                    <div>• Alternative workflow routing</div>
                                    <div>• Data correction and resubmission</div>
                                    <div>• Alert notifications for investigation</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔧 Dead Letter Queue Configuration:</strong><br/>
                                  1. Create error handling workflow for failed executions<br/>
                                  2. Set maximum retry attempts (default: 3)<br/>
                                  3. Configure retry delays: 1min → 5min → 15min<br/>
                                  4. Route failures to investigation queue after max retries<br/>
                                  5. Set up alerts for critical workflow failures
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🚀 Advanced Queue Patterns</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Fan-Out Pattern</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300 text-xs">Distribute single message to multiple processing queues for parallel processing.</p>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                                <div><strong>Use Case:</strong> Process order across multiple systems</div>
                                <div><strong>Implementation:</strong> Split node → Multiple queue endpoints</div>
                                <div><strong>Benefit:</strong> 3-5x faster processing for complex workflows</div>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                                Order → [Inventory, Payment, Shipping, Email] → Merge
                              </div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Batch Processing Pattern</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300 text-xs">Collect multiple messages and process them together for efficiency.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs">
                                <div><strong>Use Case:</strong> Bulk email sending, data imports</div>
                                <div><strong>Implementation:</strong> Wait node + batch size trigger</div>
                                <div><strong>Benefit:</strong> 60-80% reduction in API calls and processing time</div>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                                Collect 50 items → Process batch → Distribute results
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">📋 Queue Management Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Queue Setup ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured Redis connection</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set appropriate queue modes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Defined priority levels</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured worker allocation</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Error Handling ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented dead letter queues</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set retry logic and limits</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added failure notifications</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Created recovery workflows</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Monitoring ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up queue depth alerts</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Monitor processing times</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Track success/failure rates</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented performance metrics</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Media Processing Queue</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Video processing company with 10,000+ uploads daily. Mixed file sizes (100MB-5GB), different priority levels 
                              (user uploads vs. premium customers), and varying processing times (2min-2hours).
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Solution Implemented:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Priority Queues:</strong> Premium (90% workers) vs Free users (10% workers)</div>
                              <div>• <strong>Size-based Routing:</strong> Small files (&lt;500MB) → fast queue, Large files → dedicated workers</div>
                              <div>• <strong>Batch Processing:</strong> Thumbnail generation batched by 50 files</div>
                              <div>• <strong>Dead Letter Queue:</strong> Corrupted files routed to manual review queue</div>
                              <div>• <strong>Auto-scaling:</strong> Workers scale 2-20 based on queue depth</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• 75% reduction in average processing time</div>
                              <div>• 99.8% success rate (up from 87%)</div>
                              <div>• Premium users: 2min average processing (was 45min)</div>
                              <div>• 40% reduction in infrastructure costs through efficient batching</div>
                              <div>• Near-zero manual intervention required</div>
                            </div>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🚀 Advanced Parallel Processing &amp; Concurrent Execution Mastery
                      </h4>
                      <p className="mb-4">
                        Master parallel processing techniques to dramatically improve workflow performance through concurrent execution. 
                        Learn to design workflows that process multiple data streams simultaneously, optimize resource utilization, 
                        and implement sophisticated parallelization patterns that scale from simple batch operations to complex distributed systems.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Parallelization Strategies</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">🔀 Data Parallelism</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Process different parts of the same dataset simultaneously across multiple workflow branches. 
                                Split large datasets into chunks and process each chunk independently for massive performance gains.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Use Cases:</strong> Bulk data processing, API batch operations, file transformations</div>
                                <div><strong>Performance Gain:</strong> 3-10x improvement depending on data size</div>
                                <div><strong>Resource Requirements:</strong> Multiple CPU cores, adequate memory per thread</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">⚡ Task Parallelism</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Execute different, independent operations simultaneously. Instead of waiting for each task to complete 
                                sequentially, run multiple tasks concurrently when they don't depend on each other's results.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Examples:</strong> Parallel API calls, concurrent database operations, simultaneous file uploads</div>
                                <div><strong>Benefits:</strong> Reduced total execution time, better resource utilization</div>
                                <div><strong>Complexity:</strong> Requires careful dependency management and error handling</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🏗️ Implementation Patterns</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-indigo-600 dark:text-indigo-400">🌟 Fan-Out/Fan-In Pattern</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Split workflow into parallel branches (fan-out), process each branch independently, 
                                then merge results back together (fan-in). Perfect for divide-and-conquer scenarios.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Structure:</strong> Split → Process in Parallel → Merge → Continue</div>
                                <div><strong>Ideal For:</strong> Data aggregation, report generation, multi-source data collection</div>
                                <div><strong>Performance Impact:</strong> Near-linear scaling with number of branches</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">🔄 Pipeline Parallelism</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Create processing pipeline stages where different parts of your workflow process different 
                                data items simultaneously. Like an assembly line where multiple stages work concurrently.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Stages:</strong> Data ingestion → Processing → Validation → Output</div>
                                <div><strong>Throughput:</strong> Continuous processing with overlapping stages</div>
                                <div><strong>Efficiency:</strong> Maximizes resource utilization across all stages</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🛠️ Parallel Processing Implementation Guide</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">1. Design Phase</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Identify independent operations</div>
                              <div>• Map data dependencies</div>
                              <div>• Calculate resource requirements</div>
                              <div>• Design error handling strategy</div>
                              <div>• Plan result aggregation method</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">2. Implementation</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Configure parallel execution nodes</div>
                              <div>• Set appropriate batch sizes</div>
                              <div>• Implement synchronization points</div>
                              <div>• Add progress monitoring</div>
                              <div>• Configure resource limits</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">3. Optimization</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Monitor execution patterns</div>
                              <div>• Adjust parallelism levels</div>
                              <div>• Optimize memory usage</div>
                              <div>• Fine-tune batch sizes</div>
                              <div>• Balance load distribution</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Parallel Processing Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced parallel processing techniques! Your workflows can now achieve dramatic 
                        performance improvements through intelligent concurrent execution. Ready for load balancing optimization!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Parallel Processing</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Load Balancing</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-5',
              title: 'Load Balancing',
              description: 'Balance workload across execution windows',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        ⚖️ Advanced Load Balancing &amp; Workload Distribution Optimization
                      </h4>
                      <p className="mb-4">
                        Master sophisticated load balancing techniques to distribute workflow execution optimally across time windows, 
                        resources, and execution environments. Learn to prevent system overload, maximize throughput, and ensure 
                        consistent performance under varying workload conditions through intelligent distribution strategies.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Load Distribution Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Temporal Distribution:</strong> Spread workloads across optimal time windows</div>
                            <div><strong>Resource Balancing:</strong> Distribute based on CPU, memory, and I/O availability</div>
                            <div><strong>Geographic Distribution:</strong> Leverage multiple regions for global optimization</div>
                            <div><strong>Priority-Based Routing:</strong> Route critical workflows to best-performing resources</div>
                            <div><strong>Adaptive Algorithms:</strong> Dynamically adjust distribution based on real-time metrics</div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🏗️ Balancing Algorithms</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Round Robin:</strong> Systematic rotation across available resources</div>
                            <div><strong>Weighted Distribution:</strong> Capacity-based workload allocation</div>
                            <div><strong>Least Connections:</strong> Route to resources with lowest current load</div>
                            <div><strong>Response Time-Based:</strong> Direct traffic to fastest-responding resources</div>
                            <div><strong>Health-Aware Routing:</strong> Avoid failed or degraded resources automatically</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">⚖️ Load Balancing Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced load balancing techniques! Your workflows can now intelligently distribute 
                        workloads for optimal performance and resource utilization. Ready to implement priority management!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Load Balancing</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Priority Management</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-6',
              title: 'Priority Management',
              description: 'Implement workflow priority systems',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🎯 Advanced Priority Management &amp; Intelligent Workflow Orchestration
                      </h4>
                      <p className="mb-4">
                        Master sophisticated priority management systems to ensure critical workflows execute first while optimizing 
                        overall system throughput. Learn to implement dynamic priority algorithms, resource allocation strategies, 
                        and intelligent queuing mechanisms that adapt to changing business requirements and system conditions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🏆 Priority Classification Systems</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">🚨 Critical Priority (P0)</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Mission-critical workflows that must execute immediately regardless of system load. 
                                These workflows have business-critical impact and cannot tolerate delays.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Examples:</strong> Security alerts, payment processing, system health checks</div>
                                <div><strong>SLA:</strong> Execute within 30 seconds, 99.99% reliability</div>
                                <div><strong>Resource Allocation:</strong> Dedicated resources, unlimited retries</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">⚡ High Priority (P1)</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Important business workflows that should execute quickly but can tolerate brief delays 
                                during peak load periods. Balance urgency with resource efficiency.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Examples:</strong> Customer notifications, order processing, data synchronization</div>
                                <div><strong>SLA:</strong> Execute within 5 minutes, 99.9% reliability</div>
                                <div><strong>Resource Allocation:</strong> Priority access, limited retries</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚙️ Dynamic Priority Algorithms</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">📈 Aging Algorithm</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Gradually increase priority of waiting workflows to prevent starvation. 
                                Lower priority tasks eventually get promoted if they wait too long.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Formula:</strong> Priority = Base Priority + (Wait Time × Aging Factor)</div>
                                <div><strong>Prevents:</strong> Task starvation, ensures fairness</div>
                                <div><strong>Configuration:</strong> Adjustable aging rates per workflow type</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-teal-600 dark:text-teal-400">🎯 Context-Aware Prioritization</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Dynamically adjust priorities based on real-time business context, system load, 
                                and external factors like time of day, user activity, or market conditions.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Factors:</strong> Business hours, system load, user behavior, external events</div>
                                <div><strong>Intelligence:</strong> Machine learning-driven priority adjustment</div>
                                <div><strong>Adaptation:</strong> Learns from historical execution patterns</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🔧 Priority Management Implementation</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">1. Classification Setup</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Define priority levels and SLAs</div>
                              <div>• Map workflows to priority classes</div>
                              <div>• Configure resource allocations</div>
                              <div>• Set aging parameters</div>
                              <div>• Define escalation policies</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">2. Queue Management</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Implement priority queues</div>
                              <div>• Configure queue limits per priority</div>
                              <div>• Set up overflow handling</div>
                              <div>• Monitor queue depths</div>
                              <div>• Implement fair scheduling</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">3. Monitoring &amp; Optimization</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Track SLA compliance</div>
                              <div>• Monitor priority distribution</div>
                              <div>• Analyze wait times</div>
                              <div>• Optimize priority algorithms</div>
                              <div>• Adjust based on performance</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Priority Management Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced priority management! Your workflows now execute in optimal order based on 
                        business importance and system conditions. Ready to implement dynamic scheduling automation!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Priority Management</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Dynamic Scheduling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        🤖 Advanced Dynamic Scheduling &amp; Intelligent Automation
                      </h4>
                      <p className="mb-4">
                        Master cutting-edge dynamic scheduling techniques that automatically adapt workflow execution timing 
                        based on real-time conditions, business rules, and predictive analytics. Transform static schedules 
                        into intelligent, self-optimizing systems that maximize efficiency and respond to changing requirements.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🧠 Intelligent Scheduling Algorithms</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Condition-Based Scheduling:</strong> Execute workflows when specific conditions are met</div>
                            <div><strong>Predictive Scheduling:</strong> Use ML to predict optimal execution times</div>
                            <div><strong>Event-Driven Scheduling:</strong> React to real-time events and triggers</div>
                            <div><strong>Resource-Aware Scheduling:</strong> Adapt timing based on resource availability</div>
                            <div><strong>Business Rule Integration:</strong> Incorporate complex business logic into scheduling</div>
                          </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">⚡ Adaptive Mechanisms</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Real-Time Adjustment:</strong> Modify schedules based on current system state</div>
                            <div><strong>Load-Based Optimization:</strong> Shift execution times during high-load periods</div>
                            <div><strong>Performance Learning:</strong> Continuously improve scheduling decisions</div>
                            <div><strong>Failure Recovery:</strong> Automatically reschedule failed or delayed workflows</div>
                            <div><strong>Priority Rebalancing:</strong> Dynamically adjust priorities based on business needs</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🔧 Step-by-Step Dynamic Scheduling Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Condition Framework Setup (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Create intelligent condition-based scheduling that responds to real-time system and business states.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">System Conditions:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>CPU Usage:</strong> Schedule when CPU &lt; 70%</div>
                                    <div>• <strong>Memory Available:</strong> Queue when RAM &gt; 2GB free</div>
                                    <div>• <strong>Queue Depth:</strong> Delay if queue &gt; 100 items</div>
                                    <div>• <strong>Network Latency:</strong> Postpone if response &gt; 500ms</div>
                                    <div>• <strong>API Rate Limits:</strong> Pause until reset window</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Business Conditions:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Business Hours:</strong> Boost priority 9-5 PM</div>
                                    <div>• <strong>Peak Seasons:</strong> Scale up during holidays</div>
                                    <div>• <strong>User Activity:</strong> Increase frequency when active</div>
                                    <div>• <strong>Market Events:</strong> React to external triggers</div>
                                    <div>• <strong>SLA Requirements:</strong> Prioritize critical time windows</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔧 n8n Condition Implementation:</strong><br/>
                                  Use IF nodes with expression conditions:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    {"{{DateTime.now().hour >= 9 && DateTime.now().hour <= 17}}"}<br/>
                                    {"{{$json.system.cpu_usage < 70 && $json.system.memory_free > 2048}}"}<br/>
                                    {"{{$json.queue_depth < 100 && $json.api_rate_remaining > 10}}"}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Predictive Scheduling Engine (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement machine learning-driven predictive scheduling based on historical patterns and forecasting.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Predictive Models:</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Time Series Forecasting:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Historical execution patterns</div>
                                      <div>• Seasonal trend analysis</div>
                                      <div>• Weekly/monthly cycles</div>
                                      <div>• Peak period prediction</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Resource Forecasting:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• CPU utilization trends</div>
                                      <div>• Memory usage patterns</div>
                                      <div>• Network capacity planning</div>
                                      <div>• Storage growth prediction</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Implementation Example:</strong><br/>
                                  Use HTTP Request node to call prediction API:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    POST /api/predict/optimal-time<br/>
                                    Body: {"{"}"workflow_id": "workflow_123", "historical_data": true{"}"}<br/>
                                    Response: {"{"}"optimal_time": "2024-01-15T14:30:00Z", "confidence": 0.87{"}"}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Event-Driven Adaptation (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Configure real-time event processing that dynamically adjusts scheduling based on system events.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Event Types:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>System Events:</strong> High CPU, memory alerts</div>
                                    <div>• <strong>External APIs:</strong> Rate limit reached, service down</div>
                                    <div>• <strong>Business Events:</strong> Flash sales, emergency alerts</div>
                                    <div>• <strong>User Events:</strong> High traffic, bulk operations</div>
                                    <div>• <strong>Time Events:</strong> Business hours, maintenance windows</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Adaptive Actions:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Delay Execution:</strong> Postpone non-critical workflows</div>
                                    <div>• <strong>Scale Resources:</strong> Add workers dynamically</div>
                                    <div>• <strong>Route Alternatives:</strong> Use backup workflows</div>
                                    <div>• <strong>Batch Operations:</strong> Group similar tasks</div>
                                    <div>• <strong>Priority Boost:</strong> Elevate critical workflows</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>⚡ Event Processing Flow:</strong><br/>
                                  1. Monitor system metrics via webhook<br/>
                                  2. Evaluate event against scheduling rules<br/>
                                  3. Calculate optimal reschedule time<br/>
                                  4. Update workflow execution timing<br/>
                                  5. Notify stakeholders of changes
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">📋 Dynamic Scheduling Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Conditions Setup ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured system monitoring conditions</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set business rule conditions</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented time-based logic</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added resource threshold checks</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Predictive Engine ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Connected historical data sources</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented forecasting models</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set confidence thresholds</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added prediction validation</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Event Processing ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up event webhooks</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured adaptive actions</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented notification system</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested event response times</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Financial Trading Platform</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Trading platform needs to process market data, execute trades, generate reports, and send alerts. 
                              Execution timing is critical - market hours vs. after-hours, high volatility periods, regulatory deadlines.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Dynamic Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Market Hours Detection:</strong> Boost trade execution priority 9:30 AM - 4:00 PM EST</div>
                              <div>• <strong>Volatility Adaptation:</strong> Increase monitoring frequency when VIX &gt; 25</div>
                              <div>• <strong>News Event Response:</strong> Reschedule non-critical workflows during major announcements</div>
                              <div>• <strong>Regulatory Deadlines:</strong> Auto-prioritize compliance reports before 5 PM deadline</div>
                              <div>• <strong>Resource Optimization:</strong> Scale processing power based on trading volume predictions</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Trade Execution:</strong> 95% reduction in missed opportunities</div>
                              <div>• <strong>Compliance:</strong> 100% on-time regulatory report submission</div>
                              <div>• <strong>Resource Efficiency:</strong> 60% reduction in idle compute time</div>
                              <div>• <strong>Risk Management:</strong> 80% faster response to market volatility</div>
                              <div>• <strong>Cost Savings:</strong> $50k/month in optimized infrastructure costs</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 to-teal-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🤖 Dynamic Scheduling Implemented!</h4>
                      <p className="mb-4">
                        You've mastered intelligent dynamic scheduling! Your workflows now automatically adapt to changing 
                        conditions for optimal performance. Ready to implement resource-aware scheduling!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Dynamic Scheduling</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Resource-Aware Scheduling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-8',
              title: 'Resource-Aware Scheduling',
              description: 'Schedule workflows based on resource availability',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🎛️ Advanced Resource-Aware Scheduling &amp; Optimization
                      </h4>
                      <p className="mb-4">
                        Master sophisticated resource-aware scheduling that intelligently monitors system resources and 
                        optimizes workflow execution timing based on CPU, memory, network, and storage availability. 
                        Implement smart algorithms that maximize resource utilization while preventing system overload.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📊 Resource Monitoring</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>CPU Utilization:</strong> Monitor processing power and queue workflows accordingly</div>
                            <div><strong>Memory Management:</strong> Track RAM usage and schedule memory-intensive tasks optimally</div>
                            <div><strong>Network Bandwidth:</strong> Consider network capacity for data-heavy workflows</div>
                            <div><strong>Storage I/O:</strong> Monitor disk operations and optimize file-based workflows</div>
                            <div><strong>External Dependencies:</strong> Track third-party service availability and response times</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚙️ Smart Optimization</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Predictive Scaling:</strong> Anticipate resource needs and schedule accordingly</div>
                            <div><strong>Load Balancing:</strong> Distribute workflows to prevent resource bottlenecks</div>
                            <div><strong>Throttling Controls:</strong> Limit concurrent executions based on resource capacity</div>
                            <div><strong>Recovery Mechanisms:</strong> Automatically reschedule when resources become available</div>
                            <div><strong>Performance Analytics:</strong> Learn from execution patterns to improve scheduling</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔧 Step-by-Step Resource-Aware Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Resource Monitoring Setup (12 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Establish comprehensive resource monitoring to track system performance and availability in real-time.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">System Metrics:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>CPU:</strong> Usage %, cores available, thermal throttling</div>
                                    <div>• <strong>Memory:</strong> RAM usage, swap usage, cache hit rates</div>
                                    <div>• <strong>Disk I/O:</strong> Read/write IOPS, queue depth, latency</div>
                                    <div>• <strong>Network:</strong> Bandwidth utilization, packet loss, latency</div>
                                    <div>• <strong>Processes:</strong> Active connections, thread count, handles</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Application Metrics:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>n8n Workers:</strong> Active/idle workers, queue depth</div>
                                    <div>• <strong>Redis:</strong> Memory usage, connections, command latency</div>
                                    <div>• <strong>Database:</strong> Connection pool, query performance, locks</div>
                                    <div>• <strong>External APIs:</strong> Response times, rate limits, errors</div>
                                    <div>• <strong>Workflows:</strong> Execution time, success rate, resource usage</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔧 Monitoring Implementation:</strong><br/>
                                  Use HTTP Request nodes to query system APIs:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    GET /api/system/stats → CPU, Memory, Disk<br/>
                                    GET /api/n8n/metrics → Workers, Queue depth<br/>
                                    GET /api/redis/info → Redis performance<br/>
                                    GET /health/external-apis → Third-party status
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Threshold-Based Scheduling (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Configure intelligent thresholds that automatically adjust scheduling based on resource availability.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Resource Threshold Matrix:</div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-xs">
                                    <thead className="bg-gray-100 dark:bg-gray-600">
                                      <tr>
                                        <th className="px-2 py-1 text-left">Resource</th>
                                        <th className="px-2 py-1 text-left">Green Zone</th>
                                        <th className="px-2 py-1 text-left">Yellow Zone</th>
                                        <th className="px-2 py-1 text-left">Red Zone</th>
                                        <th className="px-2 py-1 text-left">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                      <tr>
                                        <td className="px-2 py-1 font-medium">CPU</td>
                                        <td className="px-2 py-1 text-green-600">&lt; 60%</td>
                                        <td className="px-2 py-1 text-yellow-600">60-80%</td>
                                        <td className="px-2 py-1 text-red-600">&gt; 80%</td>
                                        <td className="px-2 py-1">Normal → Throttle → Pause</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1 font-medium">Memory</td>
                                        <td className="px-2 py-1 text-green-600">&lt; 70%</td>
                                        <td className="px-2 py-1 text-yellow-600">70-85%</td>
                                        <td className="px-2 py-1 text-red-600">&gt; 85%</td>
                                        <td className="px-2 py-1">Normal → Limit → Delay</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1 font-medium">Disk I/O</td>
                                        <td className="px-2 py-1 text-green-600">&lt; 1000 IOPS</td>
                                        <td className="px-2 py-1 text-yellow-600">1000-2000</td>
                                        <td className="px-2 py-1 text-red-600">&gt; 2000</td>
                                        <td className="px-2 py-1">Normal → Queue → Postpone</td>
                                      </tr>
                                      <tr>
                                        <td className="px-2 py-1 font-medium">Network</td>
                                        <td className="px-2 py-1 text-green-600">&lt; 50Mbps</td>
                                        <td className="px-2 py-1 text-yellow-600">50-80Mbps</td>
                                        <td className="px-2 py-1 text-red-600">&gt; 80Mbps</td>
                                        <td className="px-2 py-1">Normal → Batch → Reschedule</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>⚙️ Threshold Logic Implementation:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    IF CPU &gt; 80% → Delay non-critical workflows 15 minutes<br/>
                                    IF Memory &gt; 85% → Route to low-memory workers<br/>
                                    IF Queue depth &gt; 50 → Scale workers up +2<br/>
                                    IF API latency &gt; 2s → Pause API-heavy workflows
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Intelligent Resource Allocation (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement smart resource allocation that matches workflow requirements with available system capacity.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Workflow Profiling:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>CPU-Intensive:</strong> Data processing, calculations</div>
                                    <div>• <strong>Memory-Heavy:</strong> Large file operations, caching</div>
                                    <div>• <strong>I/O-Bound:</strong> Database queries, file transfers</div>
                                    <div>• <strong>Network-Heavy:</strong> API calls, web scraping</div>
                                    <div>• <strong>Mixed-Load:</strong> Balanced resource requirements</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Allocation Strategies:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Affinity Scheduling:</strong> Match workload to optimal nodes</div>
                                    <div>• <strong>Resource Isolation:</strong> Separate high/low resource workflows</div>
                                    <div>• <strong>Time-slicing:</strong> Alternate between different workload types</div>
                                    <div>• <strong>Burst Capacity:</strong> Reserve resources for peak periods</div>
                                    <div>• <strong>Fair Sharing:</strong> Prevent resource starvation</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🎯 Smart Allocation Example:</strong><br/>
                                  1. Profile workflow: CPU=High, Memory=Low, I/O=Medium<br/>
                                  2. Check current resources: CPU 45%, Memory 30%, I/O 60%<br/>
                                  3. Find optimal node: Node-2 (CPU 30%, ideal for CPU-heavy)<br/>
                                  4. Schedule workflow on Node-2 with CPU priority<br/>
                                  5. Monitor execution and adjust future scheduling
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Resource-Aware Scheduling Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Monitoring Setup ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured system metrics collection</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up application monitoring</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added external dependency tracking</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented real-time dashboards</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Threshold Management ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Defined resource thresholds</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured automated actions</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up alerting mechanisms</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested threshold responses</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Resource Allocation ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Profiled workflow resource needs</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented allocation strategies</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added resource isolation</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Optimized for peak performance</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Healthcare Data Processing</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Healthcare system processes patient data, medical imaging, lab results, and billing. Peak loads during 
                              business hours (300% increase), strict HIPAA compliance requirements, and critical patient safety alerts 
                              that must execute immediately regardless of system load.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Resource-Aware Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Resource Pools:</strong> Dedicated nodes for critical vs. routine workflows</div>
                              <div>• <strong>Memory Management:</strong> Large imaging files processed only when &gt;8GB RAM available</div>
                              <div>• <strong>CPU Allocation:</strong> Lab results processing limited to 50% CPU during business hours</div>
                              <div>• <strong>Network Optimization:</strong> Medical imaging transfers scheduled during low-traffic hours</div>
                              <div>• <strong>Priority Override:</strong> Patient safety alerts bypass all resource constraints</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Patient Safety:</strong> 100% immediate processing of critical alerts</div>
                              <div>• <strong>System Stability:</strong> Zero resource-related crashes during peak hours</div>
                              <div>• <strong>Throughput:</strong> 85% increase in overall data processing capacity</div>
                              <div>• <strong>Compliance:</strong> 99.9% adherence to HIPAA processing timelines</div>
                              <div>• <strong>Cost Efficiency:</strong> 30% reduction in infrastructure costs through optimization</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎛️ Resource-Aware Scheduling Mastered!</h4>
                      <p className="mb-4">
                        You've mastered intelligent resource-aware scheduling! Your workflows now execute with perfect 
                        resource utilization and system efficiency. Ready for schedule monitoring and analytics!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Resource-Aware Scheduling</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-9',
              title: 'Schedule Monitoring',
              description: 'Monitor and analyze scheduling performance',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-yellow-600 dark:text-yellow-400">
                        📊 Advanced Schedule Monitoring &amp; Performance Analytics
                      </h4>
                      <p className="mb-4">
                        Master comprehensive schedule monitoring to track execution patterns, identify optimization opportunities, 
                        and ensure optimal scheduling performance. Implement sophisticated analytics that provide deep insights 
                        into workflow timing, resource utilization, and system efficiency for continuous improvement.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📈 Key Monitoring Metrics</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Execution Timing:</strong> Monitor actual vs. scheduled execution times</div>
                            <div><strong>Queue Performance:</strong> Track queue depths and wait times</div>
                            <div><strong>Resource Utilization:</strong> Monitor CPU, memory, and I/O usage patterns</div>
                            <div><strong>Success Rates:</strong> Track completion rates and failure patterns</div>
                            <div><strong>SLA Compliance:</strong> Monitor adherence to service level agreements</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🔍 Advanced Analytics</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Trend Analysis:</strong> Identify long-term performance patterns and trends</div>
                            <div><strong>Anomaly Detection:</strong> Automatically detect unusual execution patterns</div>
                            <div><strong>Predictive Analytics:</strong> Forecast future resource needs and bottlenecks</div>
                            <div><strong>Correlation Analysis:</strong> Find relationships between different metrics</div>
                            <div><strong>Optimization Recommendations:</strong> AI-powered suggestions for improvements</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">🔧 Step-by-Step Monitoring Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Comprehensive Metrics Collection (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Set up detailed metrics collection to capture all aspects of scheduling performance and system behavior.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Execution Metrics:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Timing Accuracy:</strong> Scheduled vs. actual start times</div>
                                    <div>• <strong>Duration Tracking:</strong> Execution time vs. estimates</div>
                                    <div>• <strong>Completion Rates:</strong> Success/failure ratios</div>
                                    <div>• <strong>Retry Patterns:</strong> Failed attempts and recovery</div>
                                    <div>• <strong>Throughput:</strong> Workflows per hour/day/week</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">System Metrics:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Queue Health:</strong> Depth, wait times, processing rates</div>
                                    <div>• <strong>Resource Usage:</strong> CPU, memory, network during execution</div>
                                    <div>• <strong>Worker Performance:</strong> Active/idle ratios, efficiency</div>
                                    <div>• <strong>External Dependencies:</strong> API response times, availability</div>
                                    <div>• <strong>Error Patterns:</strong> Types, frequency, impact analysis</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔧 Metrics Collection Setup:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    POST /api/metrics/execution<br/>
                                    Body: {"{"}"workflow_id", "start_time", "duration", "status", "resources_used"{"}"}<br/>
                                    Store in: InfluxDB, Prometheus, or custom time-series database
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Real-Time Dashboard Creation (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Build comprehensive dashboards that provide instant visibility into scheduling performance and health.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Dashboard Components:</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Performance Overview:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Execution success rate (24h)</div>
                                      <div>• Average queue wait time</div>
                                      <div>• Total workflows processed</div>
                                      <div>• System resource utilization</div>
                                      <div>• SLA compliance percentage</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Real-Time Status:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Currently executing workflows</div>
                                      <div>• Queue depth by priority</div>
                                      <div>• Active worker status</div>
                                      <div>• Recent failures and alerts</div>
                                      <div>• Resource threshold warnings</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Trend Analysis:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Execution patterns (7 days)</div>
                                      <div>• Performance trends</div>
                                      <div>• Resource usage patterns</div>
                                      <div>• Error frequency over time</div>
                                      <div>• Capacity utilization trends</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Dashboard Implementation:</strong><br/>
                                  Use Grafana, Tableau, or custom React components:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    Query: SELECT success_rate FROM executions WHERE time &gt; now() - 24h<br/>
                                    Visualization: Time series graphs, gauge charts, heatmaps<br/>
                                    Refresh: 30-second real-time updates
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Automated Alerting &amp; Anomaly Detection (7 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Configure intelligent alerting systems that proactively identify and notify about scheduling issues.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Alert Conditions:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Performance:</strong> Success rate &lt; 95%</div>
                                    <div>• <strong>Latency:</strong> Queue wait time &gt; 5 minutes</div>
                                    <div>• <strong>Capacity:</strong> Queue depth &gt; 100 items</div>
                                    <div>• <strong>Resources:</strong> CPU/Memory &gt; 85%</div>
                                    <div>• <strong>SLA:</strong> Breach of timing requirements</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Alert Channels:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Slack/Teams:</strong> Instant team notifications</div>
                                    <div>• <strong>Email:</strong> Detailed reports and summaries</div>
                                    <div>• <strong>SMS:</strong> Critical alerts for on-call staff</div>
                                    <div>• <strong>PagerDuty:</strong> Escalation for unresolved issues</div>
                                    <div>• <strong>Webhooks:</strong> Integration with other systems</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🚨 Smart Alerting Logic:</strong><br/>
                                  1. Monitor metrics against thresholds (sliding windows)<br/>
                                  2. Detect anomalies using statistical analysis<br/>
                                  3. Correlate multiple signals to reduce false positives<br/>
                                  4. Apply severity levels and escalation policies<br/>
                                  5. Include actionable context and suggested remediation
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📋 Schedule Monitoring Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Metrics Collection ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up execution metrics tracking</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured system monitoring</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added queue performance metrics</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented SLA tracking</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Dashboard Setup ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Created performance overview</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added real-time status panels</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented trend analysis</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up drill-down capabilities</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Alerting System ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured alert thresholds</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up notification channels</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented anomaly detection</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested escalation procedures</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: E-commerce Platform Monitoring</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              E-commerce platform processes orders, inventory updates, customer notifications, and analytics. 
                              Black Friday traffic spikes (1000% increase), real-time inventory synchronization across 50+ channels, 
                              and strict SLAs for payment processing and order fulfillment.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Monitoring Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Real-Time Dashboards:</strong> Order processing rates, inventory sync status, payment success rates</div>
                              <div>• <strong>Traffic Monitoring:</strong> Predictive scaling based on web traffic patterns and historical data</div>
                              <div>• <strong>SLA Tracking:</strong> Order processing &lt;30s, inventory updates &lt;5s, notifications &lt;1s</div>
                              <div>• <strong>Anomaly Detection:</strong> Unusual failure patterns, inventory discrepancies, delayed payments</div>
                              <div>• <strong>Business Intelligence:</strong> Revenue impact analysis, customer experience metrics</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Uptime:</strong> 99.95% availability during Black Friday (vs 97% previous year)</div>
                              <div>• <strong>Performance:</strong> Mean time to detection reduced from 15 minutes to 30 seconds</div>
                              <div>• <strong>Revenue Protection:</strong> $2.3M in prevented revenue loss through proactive alerting</div>
                              <div>• <strong>Operational Efficiency:</strong> 80% reduction in manual monitoring effort</div>
                              <div>• <strong>Customer Satisfaction:</strong> 25% improvement in order processing experience</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📊 Schedule Monitoring Implemented!</h4>
                      <p className="mb-4">
                        You've mastered comprehensive schedule monitoring! Your scheduling system now provides deep insights 
                        and continuous optimization. Ready to implement auto-scaling schedules!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Schedule Monitoring</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Auto-scaling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-10',
              title: 'Auto-Scaling Schedules',
              description: 'Implement auto-scaling scheduling patterns',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-pink-600 dark:text-pink-400">
                        🚀 Advanced Auto-Scaling Schedules &amp; Elastic Workflow Management
                      </h4>
                      <p className="mb-4">
                        Master cutting-edge auto-scaling schedule systems that automatically adjust workflow execution capacity 
                        based on demand, resource availability, and performance metrics. Implement intelligent scaling algorithms 
                        that ensure optimal performance while minimizing resource costs and preventing system overload.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-pink-700 dark:text-pink-300">📈 Scaling Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Predictive Scaling:</strong> Scale based on forecasted demand patterns</div>
                            <div><strong>Reactive Scaling:</strong> Respond to real-time load and performance metrics</div>
                            <div><strong>Schedule-Based Scaling:</strong> Pre-scale for known peak periods</div>
                            <div><strong>Threshold-Based Scaling:</strong> Automatic scaling when metrics exceed limits</div>
                            <div><strong>Cost-Optimized Scaling:</strong> Balance performance with resource costs</div>
                          </div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">⚙️ Smart Automation</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Demand Forecasting:</strong> ML-powered prediction of future resource needs</div>
                            <div><strong>Gradual Scaling:</strong> Smooth scaling transitions to prevent performance spikes</div>
                            <div><strong>Health Monitoring:</strong> Scale based on system health and performance metrics</div>
                            <div><strong>Failure Recovery:</strong> Automatic scaling during system failures or degradation</div>
                            <div><strong>Cost Optimization:</strong> Intelligent resource allocation to minimize expenses</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-pink-50 dark:bg-pink-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-pink-700 dark:text-pink-300">🔧 Step-by-Step Auto-Scaling Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Scaling Policy Design (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Design intelligent scaling policies that automatically adjust capacity based on multiple metrics and business requirements.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Scaling Triggers:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Queue Depth:</strong> Scale up when queue &gt; 50 items</div>
                                    <div>• <strong>CPU Utilization:</strong> Scale when CPU &gt; 70% for 5 minutes</div>
                                    <div>• <strong>Memory Usage:</strong> Scale when RAM &gt; 80% sustained</div>
                                    <div>• <strong>Response Time:</strong> Scale when latency &gt; 2 seconds</div>
                                    <div>• <strong>Error Rate:</strong> Scale up if error rate &gt; 5%</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Scaling Parameters:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Min Workers:</strong> 2 (always maintain minimum)</div>
                                    <div>• <strong>Max Workers:</strong> 20 (cost control limit)</div>
                                    <div>• <strong>Scale-up Rate:</strong> +2 workers per trigger</div>
                                    <div>• <strong>Scale-down Rate:</strong> -1 worker every 10 minutes</div>
                                    <div>• <strong>Cooldown Period:</strong> 5 minutes between scaling actions</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔧 Scaling Policy Configuration:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    if queue_depth &gt; 50 and cpu_avg_5min &gt; 70: scale_up(2)<br/>
                                    if queue_depth &lt; 10 and cpu_avg_5min &lt; 40: scale_down(1)<br/>
                                    cooldown: 300 seconds between actions
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Predictive Scaling Implementation (20 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement machine learning-driven predictive scaling that anticipates demand and scales proactively.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Predictive Models:</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Time-Series Forecasting:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Historical load patterns analysis</div>
                                      <div>• Seasonal trend identification</div>
                                      <div>• Day-of-week/hour-of-day patterns</div>
                                      <div>• Holiday and event impact modeling</div>
                                      <div>• Business cycle correlations</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">External Signal Integration:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Marketing campaign schedules</div>
                                      <div>• Product launch timelines</div>
                                      <div>• External API dependencies</div>
                                      <div>• Business event calendars</div>
                                      <div>• Weather and seasonal factors</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Predictive Implementation:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    POST /api/ml/predict-load<br/>
                                    Body: {"{"}"timeframe": "next_2_hours", "historical_data": true{"}"}<br/>
                                    Response: {"{"}"predicted_load": 850, "confidence": 0.92, "scale_recommendation": "+3"{"}"}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Cost-Optimized Scaling (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement intelligent cost optimization that balances performance requirements with infrastructure expenses.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Cost Strategies:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Spot Instances:</strong> Use cheaper, interruptible compute</div>
                                    <div>• <strong>Reserved Capacity:</strong> Pre-purchase for baseline load</div>
                                    <div>• <strong>Right-sizing:</strong> Match instance types to workload</div>
                                    <div>• <strong>Schedule-based:</strong> Scale down during off-hours</div>
                                    <div>• <strong>Multi-region:</strong> Use cheaper regions when possible</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Optimization Metrics:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Cost per workflow:</strong> Track execution costs</div>
                                    <div>• <strong>Efficiency ratio:</strong> Performance vs. cost</div>
                                    <div>• <strong>Waste reduction:</strong> Minimize idle resources</div>
                                    <div>• <strong>SLA adherence:</strong> Meet performance while minimizing cost</div>
                                    <div>• <strong>Budget controls:</strong> Prevent cost overruns</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>💰 Cost Optimization Logic:</strong><br/>
                                  1. Calculate cost per workflow execution<br/>
                                  2. Identify optimal instance mix for workload<br/>
                                  3. Implement gradual scaling to avoid waste<br/>
                                  4. Set budget alerts and auto-scaling limits<br/>
                                  5. Monitor and adjust optimization parameters
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📋 Auto-Scaling Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Scaling Policies ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Defined scaling triggers and thresholds</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set min/max worker limits</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured cooldown periods</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested scaling behavior</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Predictive Scaling ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented forecasting models</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Connected external signals</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated prediction accuracy</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set confidence thresholds</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Cost Optimization ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented cost tracking</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set budget limits and alerts</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Optimized instance selection</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Measured cost per workflow</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Video Streaming Platform</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Video streaming platform processes video uploads, transcoding, thumbnails, and content delivery. 
                              Extreme traffic variations (10x increase during major events), cost-sensitive margins, and strict 
                              SLAs for video processing (upload to ready in &lt;5 minutes).
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Auto-Scaling Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Predictive Scaling:</strong> Pre-scale 30 minutes before major events using calendar integration</div>
                              <div>• <strong>Multi-tier Scaling:</strong> Fast instances for critical uploads, spot instances for background processing</div>
                              <div>• <strong>Geographic Scaling:</strong> Route processing to cheapest available regions</div>
                              <div>• <strong>Content-aware Scaling:</strong> Different scaling policies for live vs. uploaded content</div>
                              <div>• <strong>Cost Controls:</strong> Automatic scaling limits based on monthly budget allocation</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Performance:</strong> 99.5% of videos processed within SLA during peak events</div>
                              <div>• <strong>Cost Reduction:</strong> 45% decrease in infrastructure costs through intelligent scaling</div>
                              <div>• <strong>Availability:</strong> Zero service degradation during 500% traffic spikes</div>
                              <div>• <strong>Efficiency:</strong> 90% average resource utilization vs. 30% before optimization</div>
                              <div>• <strong>Revenue Impact:</strong> $1.2M monthly savings reinvested into content and features</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚀 Auto-Scaling Schedules Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced auto-scaling schedule systems! Your workflows now automatically scale to meet 
                        demand while optimizing costs and performance. Ready for intelligent scheduling orchestration!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Auto-Scaling Schedules</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Orchestration</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-11',
              title: 'Scheduling Orchestration',
              description: 'Master advanced multi-workflow orchestration',
              estimated_time: '50 min',
              difficulty: 'Expert',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                        🎼 Advanced Scheduling Orchestration &amp; Multi-Workflow Coordination
                      </h4>
                      <p className="mb-4">
                        Master enterprise-level scheduling orchestration that coordinates complex multi-workflow systems 
                        with dependencies, resource sharing, and distributed execution. Learn to implement sophisticated 
                        orchestration patterns that ensure optimal coordination across your entire automation ecosystem.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🎯 Orchestration Patterns</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Dependency Chains:</strong> Sequential workflow execution with smart dependency management</div>
                            <div><strong>Parallel Orchestration:</strong> Concurrent workflow execution with resource coordination</div>
                            <div><strong>Conditional Flows:</strong> Dynamic workflow routing based on runtime conditions</div>
                            <div><strong>Federated Scheduling:</strong> Cross-system workflow coordination and synchronization</div>
                            <div><strong>Resource Pools:</strong> Shared resource allocation across multiple workflow systems</div>
                          </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">⚙️ Advanced Coordination</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Global Scheduling:</strong> Enterprise-wide workflow coordination and optimization</div>
                            <div><strong>Cross-platform Integration:</strong> Coordinate workflows across different automation tools</div>
                            <div><strong>Priority Hierarchies:</strong> Multi-level priority management with escalation</div>
                            <div><strong>Failure Cascading:</strong> Intelligent failure handling with dependency awareness</div>
                            <div><strong>Performance Orchestration:</strong> System-wide performance optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎼 Scheduling Orchestration Mastered!</h4>
                      <p className="mb-4">
                        You've mastered enterprise-level scheduling orchestration! Your system now coordinates complex 
                        multi-workflow operations with intelligent dependency management. Ready for performance optimization!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Scheduling Orchestration</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Performance Optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-12',
              title: 'Performance Optimization',
              description: 'Master ultimate scheduling performance optimization',
              estimated_time: '60 min',
              difficulty: 'Expert',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        🚀 Ultimate Scheduling Performance Optimization &amp; Mastery
                      </h4>
                      <p className="mb-4">
                        Master the pinnacle of scheduling performance optimization through advanced algorithms, 
                        cutting-edge techniques, and enterprise-grade solutions. Achieve maximum efficiency, 
                        scalability, and reliability in your scheduling systems while maintaining cost-effectiveness.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">🎯 Advanced Optimization</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Algorithm Optimization:</strong> Advanced scheduling algorithms and heuristics</div>
                            <div><strong>Machine Learning:</strong> AI-powered optimization and continuous learning</div>
                            <div><strong>Mathematical Modeling:</strong> Operations research and optimization theory</div>
                            <div><strong>Genetic Algorithms:</strong> Evolutionary optimization for complex schedules</div>
                            <div><strong>Quantum Computing:</strong> Next-generation optimization techniques</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">⚡ Performance Excellence</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Ultra-Low Latency:</strong> Sub-millisecond scheduling decisions</div>
                            <div><strong>Massive Scale:</strong> Million+ workflow coordination capabilities</div>
                            <div><strong>Real-time Optimization:</strong> Continuous performance tuning</div>
                            <div><strong>Zero-Downtime:</strong> Seamless optimization without service interruption</div>
                            <div><strong>Global Distribution:</strong> Planet-scale scheduling coordination</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🏆 SCHEDULING MASTERY COMPLETE!</h4>
                      <p className="mb-4">
                        Congratulations! You've achieved ultimate mastery in scheduling optimization. Your skills now rival 
                        the world's leading technology companies. You can build, optimize, and scale scheduling systems 
                        that handle enterprise-level complexity with world-class performance.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Performance Optimization Master</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🏆 Scheduling Expert</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🚀 Enterprise Ready</span>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        📊 Comprehensive Analytics Infrastructure Setup &amp; Configuration
                      </h4>
                      <p className="mb-4">
                        Master the foundation of analytics by setting up robust infrastructure that captures, processes, 
                        and analyzes workflow data effectively. Learn to implement comprehensive tracking systems that 
                        provide deep insights into performance, usage patterns, and optimization opportunities.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🏗️ Infrastructure Components</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Data Collection Layer:</strong> Capture workflow execution data, logs, and metrics</div>
                            <div><strong>Storage Systems:</strong> Time-series databases, data warehouses, log aggregation</div>
                            <div><strong>Processing Pipeline:</strong> Real-time data processing and transformation</div>
                            <div><strong>Analytics Engine:</strong> Query processing, aggregation, and analysis tools</div>
                            <div><strong>Visualization Layer:</strong> Dashboards, reports, and interactive analytics</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">⚙️ Configuration Essentials</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Data Retention:</strong> Configure storage policies and archival strategies</div>
                            <div><strong>Sampling Rates:</strong> Balance data completeness with storage costs</div>
                            <div><strong>Security Setup:</strong> Implement encryption, access controls, and audit trails</div>
                            <div><strong>Performance Tuning:</strong> Optimize for query speed and storage efficiency</div>
                            <div><strong>Backup &amp; Recovery:</strong> Ensure data durability and disaster recovery</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📊 Analytics Infrastructure Ready!</h4>
                      <p className="mb-4">
                        You've established a solid analytics foundation! Your infrastructure can now capture and process 
                        comprehensive workflow data. Ready to implement detailed metrics collection!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Analytics Setup</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Metrics Collection</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-2',
              title: 'Metrics Collection',
              description: 'Implement comprehensive metrics collection',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📈 Advanced Metrics Collection &amp; Performance Tracking Systems
                      </h4>
                      <p className="mb-4">
                        Master comprehensive metrics collection to capture every aspect of workflow performance, 
                        resource utilization, and business impact. Learn to implement sophisticated tracking systems 
                        that provide granular insights while maintaining optimal system performance.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Core Metrics Categories</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Execution Metrics:</strong> Duration, success rates, error counts, retry attempts</div>
                            <div><strong>Resource Metrics:</strong> CPU usage, memory consumption, I/O operations</div>
                            <div><strong>Business Metrics:</strong> Throughput, SLA compliance, cost per execution</div>
                            <div><strong>Quality Metrics:</strong> Data accuracy, completeness, validation failures</div>
                            <div><strong>User Metrics:</strong> Workflow usage patterns, adoption rates, satisfaction</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">📊 Collection Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Real-time Streaming:</strong> Immediate metric capture for critical operations</div>
                            <div><strong>Batch Processing:</strong> Efficient collection for high-volume operations</div>
                            <div><strong>Sampling Methods:</strong> Statistical sampling for large-scale deployments</div>
                            <div><strong>Custom Instrumentation:</strong> Business-specific metric collection</div>
                            <div><strong>Third-party Integration:</strong> External service metrics aggregation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📈 Metrics Collection Implemented!</h4>
                      <p className="mb-4">
                        You've mastered comprehensive metrics collection! Your system now captures detailed performance 
                        and business metrics. Ready to design efficient data pipelines!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Metrics Collection</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Data Pipelines</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-3',
              title: 'Data Pipeline Design',
              description: 'Design efficient data pipelines for analytics',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">
                        🔄 Advanced Data Pipeline Design &amp; ETL Optimization
                      </h4>
                      <p className="mb-4">
                        Master sophisticated data pipeline architectures that efficiently process, transform, and route 
                        analytics data at scale. Learn to design resilient ETL systems that handle high-volume data 
                        streams while maintaining data quality and enabling real-time analytics capabilities.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">🏗️ Pipeline Architecture</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Stream Processing:</strong> Real-time data transformation and routing</div>
                            <div><strong>Batch Processing:</strong> High-volume data processing with optimal efficiency</div>
                            <div><strong>Lambda Architecture:</strong> Combined batch and stream processing systems</div>
                            <div><strong>Microservices:</strong> Modular pipeline components for scalability</div>
                            <div><strong>Event-Driven:</strong> Reactive pipelines triggered by data events</div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">⚙️ Processing Techniques</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Data Transformation:</strong> Normalization, aggregation, enrichment</div>
                            <div><strong>Quality Assurance:</strong> Validation, cleansing, error handling</div>
                            <div><strong>Schema Evolution:</strong> Handling data structure changes gracefully</div>
                            <div><strong>Partitioning:</strong> Efficient data organization and query optimization</div>
                            <div><strong>Compression:</strong> Storage optimization and transfer efficiency</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔄 Data Pipeline Optimized!</h4>
                      <p className="mb-4">
                        You've mastered advanced data pipeline design! Your system can now process analytics data 
                        efficiently at scale. Ready to create comprehensive analytics dashboards!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Data Pipeline Design</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Dashboards</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        📊 Advanced Dashboard Creation &amp; Interactive Visualization
                      </h4>
                      <p className="mb-4">
                        Master the art of creating powerful, interactive dashboards that transform complex workflow data 
                        into actionable insights. Learn to design intuitive visualizations that enable stakeholders to 
                        quickly understand performance trends, identify issues, and make data-driven decisions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📈 Visualization Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Executive Dashboards:</strong> High-level KPIs and business metrics overview</div>
                            <div><strong>Operational Dashboards:</strong> Real-time system health and performance monitoring</div>
                            <div><strong>Analytical Dashboards:</strong> Deep-dive analysis and trend exploration</div>
                            <div><strong>Diagnostic Dashboards:</strong> Error analysis and troubleshooting interfaces</div>
                            <div><strong>Custom Views:</strong> Role-specific and personalized dashboard layouts</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎨 Design Principles</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Information Hierarchy:</strong> Prioritize most important metrics prominently</div>
                            <div><strong>Visual Clarity:</strong> Clean layouts with effective use of whitespace</div>
                            <div><strong>Color Psychology:</strong> Strategic color usage for status and emphasis</div>
                            <div><strong>Responsive Design:</strong> Optimal viewing across devices and screen sizes</div>
                            <div><strong>Interactive Elements:</strong> Drill-down capabilities and dynamic filtering</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🔧 Step-by-Step Dashboard Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Dashboard Architecture Design (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Create comprehensive dashboard architecture that serves different user personas and use cases effectively.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">User Personas:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Executives:</strong> High-level KPIs, business impact, ROI metrics</div>
                                    <div>• <strong>Operations:</strong> System health, performance, real-time status</div>
                                    <div>• <strong>Developers:</strong> Technical metrics, error rates, performance</div>
                                    <div>• <strong>Business Analysts:</strong> Trends, patterns, optimization opportunities</div>
                                    <div>• <strong>Support Teams:</strong> Issue tracking, customer impact, resolution times</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Dashboard Types:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Executive Summary:</strong> Key business metrics and trends</div>
                                    <div>• <strong>Operations Center:</strong> Real-time monitoring and alerts</div>
                                    <div>• <strong>Performance Analytics:</strong> Deep-dive performance analysis</div>
                                    <div>• <strong>Error Analysis:</strong> Failure patterns and diagnostics</div>
                                    <div>• <strong>Business Intelligence:</strong> ROI and business impact analysis</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🏗️ Architecture Framework:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    {`dashboard_structure: {`}<br/>
                                    {`  executive: [overview, trends, alerts]`}<br/>
                                    {`  operational: [realtime, health, performance]`}<br/>
                                    {`  analytical: [deep_dive, correlations, predictions]`}<br/>
                                    {`}`}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Interactive Visualization Creation (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Build dynamic, interactive visualizations that enable users to explore data and gain insights.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Visualization Components:</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Time Series Charts:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Performance trends over time</div>
                                      <div>• Execution volume patterns</div>
                                      <div>• Resource utilization graphs</div>
                                      <div>• Error rate fluctuations</div>
                                      <div>• Business metric progression</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Statistical Charts:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Distribution histograms</div>
                                      <div>• Box plots for outliers</div>
                                      <div>• Correlation heatmaps</div>
                                      <div>• Scatter plot analysis</div>
                                      <div>• Statistical summaries</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Interactive Elements:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Drill-down capabilities</div>
                                      <div>• Dynamic filtering</div>
                                      <div>• Time range selection</div>
                                      <div>• Cross-chart linking</div>
                                      <div>• Export functionality</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Implementation Tools:</strong><br/>
                                  Use Grafana, Tableau, Power BI, or custom React/D3.js:<br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    {`chart_config: { type: 'timeseries', data: workflow_metrics,`}<br/>
                                    {`interactive: true, drill_down: 'workflow_details' }`}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Responsive Design &amp; Optimization (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Ensure dashboards work seamlessly across all devices and provide optimal user experience.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Responsive Features:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Mobile Layout:</strong> Optimized for phones and tablets</div>
                                    <div>• <strong>Touch Interface:</strong> Gesture-based navigation</div>
                                    <div>• <strong>Adaptive Charts:</strong> Auto-resize based on screen size</div>
                                    <div>• <strong>Progressive Loading:</strong> Fast initial load, lazy content</div>
                                    <div>• <strong>Offline Support:</strong> Cached data for offline viewing</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Performance Optimization:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Data Virtualization:</strong> Efficient large dataset handling</div>
                                    <div>• <strong>Query Optimization:</strong> Fast database interactions</div>
                                    <div>• <strong>Caching Strategy:</strong> Intelligent data caching</div>
                                    <div>• <strong>Compression:</strong> Optimized data transfer</div>
                                    <div>• <strong>CDN Integration:</strong> Global content delivery</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🚀 Performance Targets:</strong><br/>
                                  • Dashboard load time: &lt;2 seconds<br/>
                                  • Chart render time: &lt;500ms<br/>
                                  • Data refresh rate: &lt;5 seconds for real-time<br/>
                                  • Mobile responsiveness: All screen sizes supported<br/>
                                  • Concurrent users: Support 1000+ simultaneous users
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">📋 Dashboard Creation Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Architecture Design ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Defined user personas and needs</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Created dashboard structure</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Planned information hierarchy</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Designed navigation flow</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Visualization Creation ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Built interactive charts</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added drill-down capabilities</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented filtering options</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured export features</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Optimization ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Optimized for mobile devices</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented performance optimizations</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added caching strategies</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested across devices</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: SaaS Platform Analytics</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              SaaS platform serving 2M+ users needs comprehensive analytics across customer usage, system performance, 
                              revenue metrics, and operational health. Multiple stakeholder groups require different views: executives 
                              need business KPIs, engineering needs technical metrics, support needs customer impact data.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Dashboard Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Executive Dashboard:</strong> ARR growth, churn rate, customer satisfaction, system uptime</div>
                              <div>• <strong>Operations Dashboard:</strong> Real-time system health, API performance, error rates, capacity</div>
                              <div>• <strong>Product Dashboard:</strong> Feature usage, user journeys, conversion funnels, A/B test results</div>
                              <div>• <strong>Support Dashboard:</strong> Ticket volume, resolution times, customer impact, escalations</div>
                              <div>• <strong>Engineering Dashboard:</strong> Deployment frequency, MTTR, code quality, performance metrics</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Decision Speed:</strong> 75% faster data-driven decision making across teams</div>
                              <div>• <strong>Issue Resolution:</strong> 60% reduction in MTTR through better visibility</div>
                              <div>• <strong>Customer Satisfaction:</strong> 40% improvement in support response times</div>
                              <div>• <strong>Business Growth:</strong> 25% increase in feature adoption through usage insights</div>
                              <div>• <strong>Operational Efficiency:</strong> $500k annual savings through optimization insights</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📊 Dashboard Creation Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced dashboard creation! Your visualizations now provide clear, actionable 
                        insights for all stakeholders. Ready to implement real-time monitoring systems!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Dashboard Creation</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Real-time Monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-5',
              title: 'Real-time Monitoring',
              description: 'Implement real-time monitoring solutions',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        ⚡ Real-time Monitoring &amp; Live Analytics Systems
                      </h4>
                      <p className="mb-4">
                        Master real-time monitoring systems that provide instant visibility into workflow performance, 
                        system health, and business metrics. Learn to implement live analytics that enable immediate 
                        response to issues, proactive optimization, and continuous performance improvement.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📡 Monitoring Components</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Live Data Streams:</strong> Real-time metric ingestion and processing</div>
                            <div><strong>Event Processing:</strong> Instant analysis of workflow events and states</div>
                            <div><strong>Threshold Monitoring:</strong> Automated detection of performance anomalies</div>
                            <div><strong>Health Checks:</strong> Continuous system status and availability monitoring</div>
                            <div><strong>Trend Analysis:</strong> Real-time pattern recognition and forecasting</div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">🚨 Alert Systems</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Smart Alerting:</strong> Intelligent notification routing and escalation</div>
                            <div><strong>Anomaly Detection:</strong> Machine learning-powered issue identification</div>
                            <div><strong>Multi-channel Notifications:</strong> Email, SMS, Slack, and webhook alerts</div>
                            <div><strong>Alert Correlation:</strong> Related event grouping and noise reduction</div>
                            <div><strong>Auto-remediation:</strong> Automated response to common issues</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔧 Step-by-Step Real-time Monitoring Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Live Data Stream Setup (12 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Establish high-performance data streaming infrastructure for real-time metric collection and processing.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Streaming Technologies:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Apache Kafka:</strong> High-throughput distributed streaming</div>
                                    <div>• <strong>Redis Streams:</strong> Lightweight real-time data streams</div>
                                    <div>• <strong>WebSocket Connections:</strong> Browser-based real-time updates</div>
                                    <div>• <strong>Server-Sent Events:</strong> One-way streaming to web clients</div>
                                    <div>• <strong>gRPC Streaming:</strong> High-performance binary protocol</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Stream Processing:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Apache Flink:</strong> Complex event processing</div>
                                    <div>• <strong>Apache Storm:</strong> Real-time computation</div>
                                    <div>• <strong>Kafka Streams:</strong> Stream processing library</div>
                                    <div>• <strong>Redis Pub/Sub:</strong> Message broadcasting</div>
                                    <div>• <strong>Custom Processors:</strong> Application-specific logic</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔧 Stream Configuration:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    {`kafka_config: {`}<br/>
                                    {`  topic: 'workflow-metrics', partitions: 12`}<br/>
                                    {`  retention: '7d', compression: 'snappy'`}<br/>
                                    {`  batch_size: 1000, linger_ms: 10`}<br/>
                                    {`}`}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Real-time Analytics Engine (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Build powerful real-time analytics that process streaming data and generate instant insights.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Analytics Components:</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Aggregation Engine:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Windowed calculations</div>
                                      <div>• Real-time totals</div>
                                      <div>• Moving averages</div>
                                      <div>• Percentile calculations</div>
                                      <div>• Custom aggregations</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Pattern Detection:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Anomaly identification</div>
                                      <div>• Trend recognition</div>
                                      <div>• Spike detection</div>
                                      <div>• Correlation analysis</div>
                                      <div>• Predictive indicators</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Real-time Outputs:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Live dashboard updates</div>
                                      <div>• Instant notifications</div>
                                      <div>• API endpoints</div>
                                      <div>• Database writes</div>
                                      <div>• Third-party integrations</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Analytics Pipeline:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    stream → filter → aggregate → detect_patterns → alert/dashboard<br/>
                                    window: 1min, 5min, 15min, 1hour sliding windows<br/>
                                    output: websocket, api, database, notifications
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Intelligent Alerting System (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Deploy smart alerting that reduces noise while ensuring critical issues receive immediate attention.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Smart Routing:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Severity-based:</strong> Route based on impact level</div>
                                    <div>• <strong>Time-aware:</strong> Respect business hours and time zones</div>
                                    <div>• <strong>Team-specific:</strong> Route to appropriate teams</div>
                                    <div>• <strong>Escalation rules:</strong> Auto-escalate unacknowledged alerts</div>
                                    <div>• <strong>De-duplication:</strong> Merge related alerts</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Noise Reduction:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Correlation:</strong> Group related events</div>
                                    <div>• <strong>Suppression:</strong> Silence known issues</div>
                                    <div>• <strong>Thresholds:</strong> Dynamic threshold adjustment</div>
                                    <div>• <strong>ML Filtering:</strong> AI-powered noise detection</div>
                                    <div>• <strong>Context Enrichment:</strong> Add relevant information</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🚨 Alert Flow:</strong><br/>
                                  1. Event detection → 2. Correlation analysis → 3. Severity assessment<br/>
                                  4. Routing decision → 5. Channel delivery → 6. Acknowledgment tracking<br/>
                                  7. Escalation (if needed) → 8. Resolution notification
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">📋 Real-time Monitoring Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Data Streaming ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up streaming infrastructure</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured data ingestion</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented stream processing</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested throughput capacity</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Analytics Engine ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Built aggregation pipelines</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented pattern detection</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Connected real-time outputs</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated analytics accuracy</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Smart Alerting ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured intelligent routing</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented noise reduction</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up escalation procedures</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested alert delivery</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Financial Trading System</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              High-frequency trading system processes 50k+ transactions per second, requires sub-millisecond 
                              monitoring, must detect market anomalies instantly, and comply with strict regulatory requirements. 
                              Any delay in detection can result in millions in losses.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Real-time Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Ultra-low Latency Streaming:</strong> Custom C++ stream processors with &lt;1ms latency</div>
                              <div>• <strong>Pattern Recognition:</strong> ML models for market anomaly detection in real-time</div>
                              <div>• <strong>Multi-tier Alerting:</strong> Instant circuit breakers, risk alerts, regulatory notifications</div>
                              <div>• <strong>Predictive Analytics:</strong> Real-time market trend prediction and risk assessment</div>
                              <div>• <strong>Compliance Monitoring:</strong> Automated regulatory violation detection and reporting</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Detection Speed:</strong> 99.9% of anomalies detected within 100ms</div>
                              <div>• <strong>Loss Prevention:</strong> $25M in prevented losses through early detection</div>
                              <div>• <strong>Compliance:</strong> 100% regulatory requirement adherence with automated reporting</div>
                              <div>• <strong>System Uptime:</strong> 99.99% availability during market hours</div>
                              <div>• <strong>Processing Capacity:</strong> Sustained 75k TPS with &lt;0.5ms latency</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">⚡ Real-time Monitoring Active!</h4>
                      <p className="mb-4">
                        You've implemented comprehensive real-time monitoring! Your system now provides instant visibility 
                        and proactive issue detection. Ready to build performance analysis tools!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Real-time Monitoring</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Performance Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-6',
              title: 'Alert Systems',
              description: 'Set up intelligent alerting systems',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🚨 Intelligent Alert Systems &amp; Notification Management
                      </h4>
                      <p className="mb-4">
                        Master sophisticated alerting systems that provide intelligent notifications, reduce alert fatigue, 
                        and ensure critical issues receive immediate attention. Learn to implement smart routing, escalation 
                        procedures, and multi-channel notification systems that adapt to business requirements.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎯 Alert Categories</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Critical Alerts:</strong> System failures, security breaches, data loss incidents</div>
                            <div><strong>Performance Alerts:</strong> SLA violations, resource exhaustion, slowdowns</div>
                            <div><strong>Business Alerts:</strong> Revenue impact, compliance violations, customer issues</div>
                            <div><strong>Operational Alerts:</strong> Maintenance windows, capacity warnings, updates</div>
                            <div><strong>Informational:</strong> Success notifications, weekly summaries, trend alerts</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📱 Notification Channels</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Instant Messaging:</strong> Slack, Teams, Discord, Telegram integration</div>
                            <div><strong>Email Systems:</strong> SMTP, cloud email services, rich HTML formatting</div>
                            <div><strong>SMS &amp; Voice:</strong> Critical alert delivery via mobile networks</div>
                            <div><strong>Push Notifications:</strong> Mobile app notifications and desktop alerts</div>
                            <div><strong>Webhooks:</strong> Custom integrations and third-party system notifications</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🔧 Step-by-Step Alert System Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Alert Severity Framework (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Design a comprehensive severity classification system that ensures appropriate response levels for different alert types.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Severity Levels:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>P0 - Critical:</strong> System down, data loss, security breach (0-5min response)</div>
                                    <div>• <strong>P1 - High:</strong> Performance degradation, key feature issues (5-15min response)</div>
                                    <div>• <strong>P2 - Medium:</strong> Minor issues, non-critical features (15-60min response)</div>
                                    <div>• <strong>P3 - Low:</strong> Performance warnings, capacity alerts (1-4hr response)</div>
                                    <div>• <strong>P4 - Info:</strong> Success notifications, trends (24hr+ response)</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Classification Rules:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Business Impact:</strong> Revenue, customer experience, compliance</div>
                                    <div>• <strong>Technical Impact:</strong> System availability, performance, security</div>
                                    <div>• <strong>Scope:</strong> Users affected, services impacted, duration</div>
                                    <div>• <strong>Time Sensitivity:</strong> Escalation urgency, resolution timeline</div>
                                    <div>• <strong>Context Factors:</strong> Business hours, peak times, dependencies</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>⚡ Auto-Classification:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    {`if (error_rate > 50% && affected_users > 1000) → P0`}<br/>
                                    {`if (response_time > sla_threshold * 2) → P1`}<br/>
                                    {`if (cpu_usage > 90% for > 5min) → P2`}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Multi-Channel Notification System (12 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Build a robust multi-channel notification system that delivers alerts through appropriate channels based on severity and context.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Channel Configuration:</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Immediate Channels:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• SMS for P0/P1 alerts</div>
                                      <div>• Voice calls for critical issues</div>
                                      <div>• Push notifications</div>
                                      <div>• Instant messaging</div>
                                      <div>• PagerDuty integration</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Standard Channels:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Email notifications</div>
                                      <div>• Slack/Teams messages</div>
                                      <div>• Dashboard updates</div>
                                      <div>• ITSM ticket creation</div>
                                      <div>• Webhook notifications</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Async Channels:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Email summaries</div>
                                      <div>• Weekly reports</div>
                                      <div>• RSS feeds</div>
                                      <div>• Mobile app notifications</div>
                                      <div>• API endpoints</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📨 Channel Routing Logic:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    P0: [SMS, Voice, Slack] → immediate<br/>
                                    P1: [SMS, Email, Slack] → 5min delay<br/>
                                    P2: [Email, Slack] → 15min delay<br/>
                                    P3/P4: [Email] → 1hr+ delay
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Intelligent Escalation &amp; De-duplication (8 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement smart escalation procedures and alert correlation to minimize noise while ensuring critical issues get attention.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Escalation Rules:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Time-based:</strong> Auto-escalate after acknowledgment timeouts</div>
                                    <div>• <strong>Severity-based:</strong> Immediate escalation for P0 alerts</div>
                                    <div>• <strong>Pattern-based:</strong> Escalate recurring issues</div>
                                    <div>• <strong>Context-aware:</strong> Business hours vs off-hours handling</div>
                                    <div>• <strong>Team-specific:</strong> Escalate to subject matter experts</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">De-duplication Logic:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Fingerprinting:</strong> Identify similar alert patterns</div>
                                    <div>• <strong>Correlation:</strong> Group related events by source/time</div>
                                    <div>• <strong>Suppression:</strong> Silence known maintenance events</div>
                                    <div>• <strong>Aggregation:</strong> Combine multiple instances into summaries</div>
                                    <div>• <strong>ML Enhancement:</strong> Learn from past correlation patterns</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🔄 Escalation Matrix:</strong><br/>
                                  L1 Support (0-15min) → L2 Engineering (15-45min) → L3 Senior (45min+) → Management (2hr+)<br/>
                                  <strong>De-dup Example:</strong> 50 similar errors → 1 alert with count + affected components
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📋 Alert Systems Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Severity Framework ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Defined severity levels (P0-P4)</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Created classification rules</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented auto-classification</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set response time targets</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Notification Channels ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured multi-channel delivery</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up channel routing logic</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented failover mechanisms</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested all notification channels</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Smart Features ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Built escalation procedures</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented de-duplication</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added correlation logic</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated noise reduction</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Global E-commerce Platform</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Global e-commerce platform processes $50M+ daily transactions across 50+ countries. During Black Friday, 
                              the existing alert system generated 10,000+ alerts per hour, causing alert fatigue and missed critical 
                              issues. 3 major outages went undetected for 15+ minutes due to alert noise.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Intelligent Alert Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Smart Severity Classification:</strong> ML-powered severity assignment based on business impact</div>
                              <div>• <strong>Correlation Engine:</strong> Grouped related alerts, reduced volume by 95%</div>
                              <div>• <strong>Dynamic Escalation:</strong> Context-aware routing (peak hours, geographic regions)</div>
                              <div>• <strong>Multi-Modal Delivery:</strong> SMS for P0, Slack for P1/P2, email for P3/P4</div>
                              <div>• <strong>Auto-Remediation:</strong> Automated response for 60% of common issues</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Alert Reduction:</strong> 95% reduction in alert noise (10k → 500 alerts/hour)</div>
                              <div>• <strong>MTTR Improvement:</strong> 70% faster resolution times (15min → 4.5min avg)</div>
                              <div>• <strong>Zero Missed Criticals:</strong> 100% P0 alert delivery within 30 seconds</div>
                              <div>• <strong>Revenue Protection:</strong> $12M prevented losses through faster issue detection</div>
                              <div>• <strong>Team Efficiency:</strong> 60% reduction in false positive investigations</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🚨 Alert Systems Configured!</h4>
                      <p className="mb-4">
                        You've implemented intelligent alerting systems! Your workflows now provide smart notifications 
                        and automated escalation. Ready to implement advanced trend analysis!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Alert Systems</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Trend Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📈 Advanced Trend Analysis &amp; Predictive Analytics
                      </h4>
                      <p className="mb-4">
                        Master sophisticated trend analysis techniques that reveal hidden patterns, predict future 
                        performance, and enable proactive optimization. Learn to implement time-series analysis, 
                        forecasting models, and predictive algorithms that drive strategic decision-making.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📊 Analysis Methods</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Time-Series Analysis:</strong> Seasonal patterns, cyclical trends, growth rates</div>
                            <div><strong>Statistical Modeling:</strong> Regression analysis, correlation studies, variance analysis</div>
                            <div><strong>Machine Learning:</strong> Predictive models, pattern recognition, classification</div>
                            <div><strong>Comparative Analysis:</strong> Period-over-period comparison, benchmarking</div>
                            <div><strong>Cohort Analysis:</strong> User behavior patterns and lifecycle analysis</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🔮 Forecasting Capabilities</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Performance Prediction:</strong> Future execution times and resource needs</div>
                            <div><strong>Capacity Planning:</strong> Infrastructure scaling and resource allocation</div>
                            <div><strong>Business Forecasting:</strong> Revenue impact and operational efficiency</div>
                            <div><strong>Risk Assessment:</strong> Failure probability and impact analysis</div>
                            <div><strong>Optimization Opportunities:</strong> Proactive improvement recommendations</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🔧 Step-by-Step Trend Analysis Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Time-Series Data Preparation (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Prepare and clean time-series data for accurate trend analysis and forecasting.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Data Collection:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Historical Data:</strong> Gather 12+ months of execution data</div>
                                    <div>• <strong>Granularity Levels:</strong> Hourly, daily, weekly, monthly aggregations</div>
                                    <div>• <strong>Multi-dimensional:</strong> By workflow, user, environment, region</div>
                                    <div>• <strong>External Factors:</strong> Business cycles, seasonal events, holidays</div>
                                    <div>• <strong>Quality Checks:</strong> Missing data imputation, outlier handling</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Data Preprocessing:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Normalization:</strong> Scale metrics for comparative analysis</div>
                                    <div>• <strong>Smoothing:</strong> Moving averages, exponential smoothing</div>
                                    <div>• <strong>Decomposition:</strong> Trend, seasonal, residual components</div>
                                    <div>• <strong>Feature Engineering:</strong> Lag variables, rolling statistics</div>
                                    <div>• <strong>Validation:</strong> Data integrity and consistency checks</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Data Pipeline:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    raw_data → clean → normalize → decompose → feature_engineering<br/>
                                    validation → time_indexing → lag_features → ready_for_analysis
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Advanced Statistical Analysis (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Apply sophisticated statistical methods to identify trends, patterns, and relationships.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Statistical Techniques:</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Trend Detection:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Mann-Kendall trend test</div>
                                      <div>• Linear regression slopes</div>
                                      <div>• Seasonal trend decomposition</div>
                                      <div>• Change point detection</div>
                                      <div>• Trend significance testing</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Correlation Analysis:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Cross-correlation functions</div>
                                      <div>• Granger causality tests</div>
                                      <div>• Lead-lag relationships</div>
                                      <div>• Cointegration analysis</div>
                                      <div>• Multivariate correlations</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Pattern Recognition:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Seasonal pattern identification</div>
                                      <div>• Cyclical behavior detection</div>
                                      <div>• Anomaly pattern recognition</div>
                                      <div>• Regime change detection</div>
                                      <div>• Structural break analysis</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📈 Analysis Framework:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    ARIMA models, seasonal decomposition, correlation matrices,<br/>
                                    confidence intervals, statistical significance testing
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: ML-Powered Forecasting Models (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Deploy machine learning models for accurate forecasting and prediction.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">ML Models:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>LSTM Networks:</strong> Deep learning for complex patterns</div>
                                    <div>• <strong>Prophet:</strong> Facebook's forecasting tool for seasonality</div>
                                    <div>• <strong>XGBoost:</strong> Gradient boosting for feature-rich datasets</div>
                                    <div>• <strong>Random Forest:</strong> Ensemble methods for robustness</div>
                                    <div>• <strong>SVR:</strong> Support vector regression for non-linear trends</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Model Validation:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Cross-validation:</strong> Time-series split validation</div>
                                    <div>• <strong>Metrics:</strong> MAPE, RMSE, MAE, directional accuracy</div>
                                    <div>• <strong>Ensemble Methods:</strong> Model averaging and stacking</div>
                                    <div>• <strong>Confidence Intervals:</strong> Prediction uncertainty bounds</div>
                                    <div>• <strong>Backtesting:</strong> Historical performance validation</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🤖 ML Pipeline:</strong><br/>
                                  feature_engineering → model_training → hyperparameter_tuning →<br/>
                                  validation → ensemble → deployment → monitoring → retraining
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">📋 Trend Analysis Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Data Preparation ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Collected historical time-series data</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Cleaned and normalized datasets</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Performed feature engineering</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated data quality</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Statistical Analysis ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Applied trend detection methods</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Performed correlation analysis</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Identified seasonal patterns</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated statistical significance</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">ML Forecasting ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Trained forecasting models</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated prediction accuracy</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Deployed ensemble methods</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set up automated retraining</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Retail Analytics Platform</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Major retail chain with 2,000+ stores needs to predict customer demand, optimize inventory, 
                              and forecast sales across multiple seasons and geographic regions. Previous forecasting was 
                              manual and often 30-40% inaccurate, leading to $50M annual losses from stockouts and overstock.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Trend Analysis Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Multi-level Time Series:</strong> SKU, category, store, regional trend analysis</div>
                              <div>• <strong>External Factor Integration:</strong> Weather, events, economic indicators</div>
                              <div>• <strong>ML Ensemble Forecasting:</strong> LSTM + Prophet + XGBoost model combination</div>
                              <div>• <strong>Real-time Pattern Detection:</strong> Emerging trends and viral product identification</div>
                              <div>• <strong>Automated Insights:</strong> Proactive recommendations for inventory and pricing</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Forecast Accuracy:</strong> 85% improvement (40% → 6% average error)</div>
                              <div>• <strong>Inventory Optimization:</strong> $45M reduction in carrying costs</div>
                              <div>• <strong>Revenue Growth:</strong> $120M additional revenue from better availability</div>
                              <div>• <strong>Operational Efficiency:</strong> 60% reduction in manual forecasting effort</div>
                              <div>• <strong>Decision Speed:</strong> Real-time insights vs 2-week manual analysis</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📈 Trend Analysis Implemented!</h4>
                      <p className="mb-4">
                        You've mastered advanced trend analysis! Your system now provides predictive insights and 
                        proactive optimization recommendations. Ready to establish performance benchmarks!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Trend Analysis</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Benchmarking</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-8',
              title: 'Performance Benchmarking',
              description: 'Establish performance benchmarks and KPIs',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">
                        🎯 Performance Benchmarking &amp; KPI Management
                      </h4>
                      <p className="mb-4">
                        Master comprehensive performance benchmarking that establishes industry standards, tracks progress 
                        against goals, and drives continuous improvement. Learn to create meaningful KPIs, establish 
                        baselines, and implement benchmarking systems that guide optimization efforts.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">📊 Benchmark Categories</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Performance Benchmarks:</strong> Execution speed, throughput, latency metrics</div>
                            <div><strong>Quality Benchmarks:</strong> Success rates, error frequencies, data accuracy</div>
                            <div><strong>Resource Benchmarks:</strong> CPU usage, memory consumption, cost efficiency</div>
                            <div><strong>Business Benchmarks:</strong> ROI, productivity gains, user satisfaction</div>
                            <div><strong>Industry Benchmarks:</strong> Comparative analysis against market standards</div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">📈 KPI Framework</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>SMART Goals:</strong> Specific, measurable, achievable, relevant, time-bound</div>
                            <div><strong>Leading Indicators:</strong> Predictive metrics that forecast future performance</div>
                            <div><strong>Lagging Indicators:</strong> Outcome metrics that measure historical results</div>
                            <div><strong>Balanced Scorecard:</strong> Financial, customer, process, learning perspectives</div>
                            <div><strong>OKRs Integration:</strong> Objectives and key results alignment</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🎯 Benchmarking System Established!</h4>
                      <p className="mb-4">
                        You've established comprehensive performance benchmarks! Your system now tracks progress against 
                        meaningful KPIs and industry standards. Ready to implement anomaly detection!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Performance Benchmarking</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Anomaly Detection</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-9',
              title: 'Anomaly Detection',
              description: 'Implement automated anomaly detection',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-amber-600 dark:text-amber-400">
                        🔍 Advanced Anomaly Detection &amp; Intelligent Issue Identification
                      </h4>
                      <p className="mb-4">
                        Master sophisticated anomaly detection systems that automatically identify unusual patterns, 
                        predict potential issues, and enable proactive problem resolution. Learn to implement machine 
                        learning algorithms, statistical methods, and intelligent monitoring that catches problems early.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">🤖 Detection Methods</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Statistical Analysis:</strong> Standard deviation, z-scores, control charts</div>
                            <div><strong>Machine Learning:</strong> Isolation forests, clustering, neural networks</div>
                            <div><strong>Time-Series Analysis:</strong> Seasonal decomposition, trend analysis</div>
                            <div><strong>Threshold-Based:</strong> Dynamic thresholds, adaptive limits</div>
                            <div><strong>Pattern Recognition:</strong> Sequence analysis, behavior modeling</div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">🎯 Anomaly Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Point Anomalies:</strong> Individual data points that deviate significantly</div>
                            <div><strong>Contextual Anomalies:</strong> Unusual behavior in specific contexts</div>
                            <div><strong>Collective Anomalies:</strong> Groups of data points forming anomalous patterns</div>
                            <div><strong>Performance Anomalies:</strong> Execution time, resource usage deviations</div>
                            <div><strong>Business Anomalies:</strong> Revenue impact, customer behavior changes</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">🔧 Step-by-Step Anomaly Detection Implementation</h5>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Multi-Algorithm Detection Framework (20 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Deploy multiple detection algorithms to catch different types of anomalies with high accuracy and low false positives.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Statistical Methods:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Z-Score Analysis:</strong> Standard deviation-based detection</div>
                                    <div>• <strong>Interquartile Range (IQR):</strong> Quartile-based outlier detection</div>
                                    <div>• <strong>Modified Z-Score:</strong> Median absolute deviation method</div>
                                    <div>• <strong>Grubbs' Test:</strong> Single outlier detection in normal distributions</div>
                                    <div>• <strong>Dixon's Q Test:</strong> Outlier detection for small datasets</div>
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Machine Learning:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Isolation Forest:</strong> Unsupervised anomaly detection</div>
                                    <div>• <strong>Local Outlier Factor:</strong> Density-based detection</div>
                                    <div>• <strong>One-Class SVM:</strong> Support vector machine outlier detection</div>
                                    <div>• <strong>Autoencoders:</strong> Neural network reconstruction error</div>
                                    <div>• <strong>DBSCAN:</strong> Clustering-based anomaly identification</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🤖 Ensemble Approach:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    statistical_methods + ml_algorithms → ensemble_voting →<br/>
                                    confidence_scoring → final_anomaly_classification
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Real-time Pattern Analysis (15 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Implement real-time pattern analysis that detects complex anomalies in streaming data.</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Pattern Detection:</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Temporal Patterns:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Sequential anomalies</div>
                                      <div>• Trend deviations</div>
                                      <div>• Seasonal violations</div>
                                      <div>• Cyclical disruptions</div>
                                      <div>• Change point detection</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Behavioral Patterns:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• User behavior anomalies</div>
                                      <div>• System usage patterns</div>
                                      <div>• Performance deviations</div>
                                      <div>• Resource consumption</div>
                                      <div>• Error rate patterns</div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                    <div className="font-medium text-xs mb-1">Contextual Analysis:</div>
                                    <div className="text-xs space-y-1">
                                      <div>• Time-of-day context</div>
                                      <div>• Business cycle awareness</div>
                                      <div>• Environmental factors</div>
                                      <div>• Dependency relationships</div>
                                      <div>• Cross-system correlations</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>📊 Pattern Pipeline:</strong><br/>
                                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    stream_data → pattern_extraction → context_analysis →<br/>
                                    anomaly_scoring → threshold_comparison → alert_generation
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-4 rounded">
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Intelligent Response &amp; Learning (10 minutes)</h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-600 dark:text-gray-300">Build intelligent response systems that learn from feedback and improve detection accuracy over time.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Smart Response:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Severity Classification:</strong> Auto-prioritize anomalies by impact</div>
                                    <div>• <strong>Context Enrichment:</strong> Add relevant diagnostic information</div>
                                    <div>• <strong>Root Cause Hints:</strong> Suggest potential causes and solutions</div>
                                    <div>• <strong>Impact Assessment:</strong> Estimate business and technical impact</div>
                                    <div>• <strong>Automated Remediation:</strong> Trigger self-healing workflows</div>
                                  </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                  <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Continuous Learning:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• <strong>Feedback Loop:</strong> Learn from user classifications</div>
                                    <div>• <strong>Model Retraining:</strong> Periodic algorithm updates</div>
                                    <div>• <strong>Threshold Adaptation:</strong> Dynamic sensitivity adjustment</div>
                                    <div>• <strong>Pattern Updates:</strong> Evolving anomaly definitions</div>
                                    <div>• <strong>Performance Metrics:</strong> Accuracy, precision, recall tracking</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="text-xs">
                                  <strong>🎯 Learning Cycle:</strong><br/>
                                  anomaly_detection → human_feedback → model_update → improved_detection →<br/>
                                  validation → deployment → monitoring → feedback (continuous loop)
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                        <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📋 Anomaly Detection Checklist</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Detection Framework ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Deployed multiple detection algorithms</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Configured ensemble voting</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Set confidence thresholds</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Validated detection accuracy</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Pattern Analysis ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented real-time analysis</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added contextual awareness</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Built pattern recognition</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Tested streaming detection</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-sm">Learning System ✓</h6>
                            <div className="space-y-1 text-xs">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Built feedback mechanisms</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Automated model retraining</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Added performance tracking</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>Implemented adaptive thresholds</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🎯 Real-World Example: Cloud Infrastructure Monitoring</h5>
                        <div className="text-sm space-y-3">
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Major cloud provider managing 100k+ servers across 50+ data centers needed to detect infrastructure 
                              anomalies before they impact customers. Traditional monitoring missed 40% of subtle issues, 
                              and alert fatigue from 50k+ daily alerts overwhelmed operations teams.
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Anomaly Detection Solution:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Multi-layered Detection:</strong> Statistical + ML + time-series analysis ensemble</div>
                              <div>• <strong>Contextual Intelligence:</strong> Datacenter, region, workload-aware detection</div>
                              <div>• <strong>Predictive Anomalies:</strong> Forecast failures 30-60 minutes ahead</div>
                              <div>• <strong>Correlation Engine:</strong> Cross-system anomaly relationship mapping</div>
                              <div>• <strong>Self-Learning System:</strong> Continuous model improvement from incident feedback</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-600 p-3 rounded">
                            <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                            <div className="text-xs space-y-1">
                              <div>• <strong>Detection Accuracy:</strong> 95% anomaly detection with 2% false positive rate</div>
                              <div>• <strong>Early Warning:</strong> 85% of critical issues detected 45+ minutes early</div>
                              <div>• <strong>Alert Reduction:</strong> 90% reduction in alert noise (50k → 5k daily alerts)</div>
                              <div>• <strong>Uptime Improvement:</strong> 99.95% → 99.99% service availability</div>
                              <div>• <strong>Cost Savings:</strong> $25M annual savings from prevented outages</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">🔍 Anomaly Detection Active!</h4>
                      <p className="mb-4">
                        You've implemented intelligent anomaly detection! Your system now automatically identifies 
                        unusual patterns and potential issues. Ready to develop custom business metrics!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Anomaly Detection</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Custom Metrics</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                        📋 Advanced Automated Reporting &amp; Intelligence Systems
                      </h4>
                      <p className="mb-4">
                        Master sophisticated automated reporting systems that generate intelligent, actionable insights from your 
                        n8n workflow data. Learn to create dynamic reports that adapt to business needs, provide real-time insights, 
                        and deliver critical information to stakeholders automatically across multiple channels and formats.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">📊 Report Types &amp; Formats</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">📈 Executive Dashboards</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                High-level summaries for business leadership with key performance indicators, 
                                trend analysis, and strategic insights presented in executive-friendly formats.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Metrics:</strong> ROI, efficiency gains, cost savings, success rates</div>
                                <div><strong>Frequency:</strong> Weekly, monthly, quarterly business reviews</div>
                                <div><strong>Format:</strong> Visual dashboards, PDF summaries, PowerPoint presentations</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">🔧 Operational Reports</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Detailed technical reports for operations teams with granular metrics, 
                                performance analysis, and actionable recommendations for system optimization.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Content:</strong> Execution logs, error analysis, performance metrics, resource usage</div>
                                <div><strong>Schedule:</strong> Daily, real-time alerts, incident-triggered reports</div>
                                <div><strong>Delivery:</strong> Email, Slack, automated ticketing systems</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🤖 Automation Features</h5>
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-purple-600 dark:text-purple-400">🎯 Intelligent Scheduling</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Smart scheduling that adapts to business cycles, stakeholder availability, 
                                and data freshness requirements for optimal report delivery timing.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Business Rules:</strong> Skip weekends, adjust for holidays, timezone optimization</div>
                                <div><strong>Data-Driven:</strong> Wait for data completeness, trigger on threshold changes</div>
                                <div><strong>Personalization:</strong> Individual preferences, role-based delivery schedules</div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-700 p-4 rounded">
                              <h6 className="font-medium text-sm mb-2 text-orange-600 dark:text-orange-400">📤 Multi-Channel Distribution</h6>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                Automated distribution across multiple channels with format optimization 
                                for each platform and recipient preference management.
                              </p>
                              <div className="text-xs space-y-1">
                                <div><strong>Email:</strong> HTML reports, PDF attachments, embedded charts</div>
                                <div><strong>Collaboration:</strong> Slack notifications, Teams updates, Discord alerts</div>
                                <div><strong>Storage:</strong> Cloud storage, database archival, API endpoints</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-5 rounded">
                        <h5 className="font-semibold mb-3">🛠️ Report Automation Implementation</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h6 className="font-medium mb-2 text-emerald-600 dark:text-emerald-400">1. Data Collection</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Configure data sources and connectors</div>
                              <div>• Set up real-time data streaming</div>
                              <div>• Implement data quality checks</div>
                              <div>• Design aggregation workflows</div>
                              <div>• Establish data retention policies</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">2. Report Generation</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Create dynamic report templates</div>
                              <div>• Implement conditional formatting</div>
                              <div>• Add interactive visualizations</div>
                              <div>• Configure multi-format output</div>
                              <div>• Set up version control</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">3. Distribution &amp; Monitoring</h6>
                            <div className="space-y-2 text-sm">
                              <div>• Configure delivery channels</div>
                              <div>• Set up recipient management</div>
                              <div>• Implement delivery tracking</div>
                              <div>• Monitor report performance</div>
                              <div>• Collect feedback and optimize</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📋 Automated Reporting Mastered!</h4>
                      <p className="mb-4">
                        You've mastered advanced automated reporting systems! Your workflows now generate intelligent, 
                        actionable reports automatically. Ready to develop custom business metrics and KPIs!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Automated Reports</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Custom Metrics</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-11',
              title: 'Custom Metrics',
              description: 'Develop custom business metrics and KPIs',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-violet-600 dark:text-violet-400">
                        📊 Custom Business Metrics &amp; KPI Development
                      </h4>
                      <p className="mb-4">
                        Master the creation of custom business metrics that align with organizational goals and drive 
                        strategic decision-making. Learn to design meaningful KPIs, implement custom calculations, 
                        and create metrics that provide unique insights into workflow performance and business impact.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-violet-50 dark:bg-violet-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-violet-700 dark:text-violet-300">🎯 Metric Categories</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Operational Metrics:</strong> Efficiency ratios, processing speeds, error rates</div>
                            <div><strong>Financial Metrics:</strong> Cost per execution, ROI, revenue attribution</div>
                            <div><strong>Quality Metrics:</strong> Data accuracy, completeness, validation scores</div>
                            <div><strong>User Experience:</strong> Satisfaction scores, adoption rates, usage patterns</div>
                            <div><strong>Strategic Metrics:</strong> Goal alignment, competitive advantage, innovation</div>
                          </div>
                        </div>

                        <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-fuchsia-700 dark:text-fuchsia-300">⚙️ Implementation Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Dynamic Calculations:</strong> Real-time metric computation and aggregation</div>
                            <div><strong>Custom Formulas:</strong> Complex business logic and weighted scoring</div>
                            <div><strong>Contextual Metrics:</strong> Environment-specific and role-based calculations</div>
                            <div><strong>Composite Metrics:</strong> Multi-dimensional scoring and index creation</div>
                            <div><strong>Threshold Management:</strong> Dynamic targets and performance ranges</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📊 Custom Metrics Implemented!</h4>
                      <p className="mb-4">
                        You've mastered custom business metrics development! Your system now provides unique insights 
                        aligned with business goals. Ready to implement data export and integration systems!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Custom Metrics</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Ready for Data Export</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'analytics-step-12',
              title: 'Data Export & Integration',
              description: 'Set up data export and third-party integrations',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-pink-600 dark:text-pink-400">
                        📤 Advanced Data Export &amp; Third-Party Integration Systems
                      </h4>
                      <p className="mb-4">
                        Master sophisticated data export capabilities and seamless third-party integrations that extend 
                        your analytics reach across the enterprise ecosystem. Learn to implement secure data sharing, 
                        real-time synchronization, and enterprise-grade integration patterns.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-pink-700 dark:text-pink-300">📊 Export Formats</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Structured Data:</strong> JSON, XML, CSV, Parquet, Avro formats</div>
                            <div><strong>Database Exports:</strong> SQL dumps, ETL pipelines, data warehouse loading</div>
                            <div><strong>API Endpoints:</strong> REST APIs, GraphQL, real-time websockets</div>
                            <div><strong>Cloud Storage:</strong> S3, Azure Blob, Google Cloud Storage integration</div>
                            <div><strong>Enterprise Systems:</strong> ERP, CRM, BI tool native connections</div>
                          </div>
                        </div>

                        <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-rose-700 dark:text-rose-300">🔗 Integration Patterns</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Real-time Streaming:</strong> Apache Kafka, event-driven architectures</div>
                            <div><strong>Batch Processing:</strong> Scheduled exports, bulk data transfers</div>
                            <div><strong>Hybrid Sync:</strong> Real-time critical data, batch for historical</div>
                            <div><strong>Microservices:</strong> Service mesh integration, API gateways</div>
                            <div><strong>Enterprise Patterns:</strong> ESB integration, message queues</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">📤 Data Export &amp; Integration Complete!</h4>
                      <p className="mb-4">
                        You've mastered advanced data export and integration systems! Your analytics now seamlessly 
                        integrate with enterprise systems and provide data where it's needed most. Analytics optimization complete!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">✅ Data Export &amp; Integration</span>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">🎯 Analytics Mastery Complete</span>
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
                            <span className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'} px-3 py-1 rounded`}>
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