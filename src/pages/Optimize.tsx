import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Settings, 
  BarChart3, 
  AlertTriangle, 
  GitBranch,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  Database,
  Cpu,
  Activity
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const Optimize: React.FC = () => {
  const { theme } = useTheme();

  const optimizationAreas = [
    {
      title: "Performance Scaling",
      description: "Optimize workflow execution speed and resource usage",
      icon: <Zap className="h-6 w-6" />,
      metrics: { improvement: "+45%", status: "Good" },
      color: "yellow"
    },
    {
      title: "Error Handling",
      description: "Implement robust error catching and recovery mechanisms",
      icon: <Shield className="h-6 w-6" />,
      metrics: { improvement: "+89%", status: "Excellent" },
      color: "red"
    },
    {
      title: "Resource Management",
      description: "Monitor and optimize memory and CPU usage",
      icon: <Cpu className="h-6 w-6" />,
      metrics: { improvement: "+32%", status: "Good" },
      color: "blue"
    },
    {
      title: "Conditional Logic",
      description: "Create smart branching and decision-making flows",
      icon: <GitBranch className="h-6 w-6" />,
      metrics: { improvement: "+67%", status: "Very Good" },
      color: "green"
    }
  ];

  const performanceMetrics = [
    {
      label: "Avg. Execution Time",
      value: "2.3s",
      change: "-23%",
      isPositive: true
    },
    {
      label: "Error Rate",
      value: "0.8%",
      change: "-45%",
      isPositive: true
    },
    {
      label: "Memory Usage",
      value: "156MB",
      change: "-12%",
      isPositive: true
    },
    {
      label: "Success Rate",
      value: "99.2%",
      change: "+2.1%",
      isPositive: true
    }
  ];

  const optimizationTips = [
    {
      category: "Performance",
      tips: [
        "Use parallel execution for independent tasks",
        "Implement caching for frequently accessed data",
        "Optimize database queries and connections",
        "Use batch processing for bulk operations"
      ]
    },
    {
      category: "Error Handling",
      tips: [
        "Add try-catch blocks around critical operations",
        "Implement exponential backoff for retries",
        "Log detailed error information for debugging",
        "Set up fallback mechanisms for critical flows"
      ]
    },
    {
      category: "Monitoring",
      tips: [
        "Set up comprehensive logging at key points",
        "Monitor resource usage and set alerts",
        "Track execution patterns and bottlenecks",
        "Implement health checks for dependencies"
      ]
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-orange-200 mb-4">
            <Settings className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">OPTIMIZE</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Scale & Perfect Your Workflows
          </h1>
          
          <p className="text-orange-100 text-lg md:text-xl max-w-2xl mb-8">
            Fine-tune your automation workflows for maximum performance, reliability, 
            and scalability with advanced optimization techniques.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-orange-700 hover:bg-orange-50">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analyze Performance
            </Button>
            
            <Button variant="outline" className="border-orange-300 text-white hover:bg-white/10">
              View Optimization Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <div className="flex flex-col">
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {metric.label}
              </span>
              <div className="flex items-baseline mt-2">
                <span className={`text-2xl font-bold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {metric.value}
                </span>
                <span className={`ml-2 text-sm font-medium ${
                  metric.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Optimization Areas */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Optimization Areas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {optimizationAreas.map((area, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${area.color}-100 dark:bg-${area.color}-900/30 text-${area.color}-600 dark:text-${area.color}-400 mr-4`}>
                    {area.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {area.title}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {area.metrics.improvement} improvement
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  area.metrics.status === 'Excellent' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                  area.metrics.status === 'Very Good' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                  'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                }`}>
                  {area.metrics.status}
                </span>
              </div>
              
              <Button variant="outline" className="w-full">
                Optimize Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Performance Trends
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Last 7 days
            </Button>
            <Button variant="outline" size="sm">
              Last 30 days
            </Button>
          </div>
        </div>
        
        <div className={`h-64 rounded-lg flex items-center justify-center ${
          theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <div className="text-center">
            <Activity className={`h-8 w-8 mx-auto mb-2 ${
              theme === 'gradient' ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
            <p className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
              Performance chart visualization would go here
            </p>
          </div>
        </div>
      </Card>

      {/* Optimization Tips */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Optimization Best Practices
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {optimizationTips.map((section, index) => (
            <Card key={index}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start">
                    <div className={`h-2 w-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <p className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Resource Monitor */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-orange-600/20 border-orange-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-orange-900/20'
      }>
        <div className="space-y-6">
          <h3 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Resource Monitor
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "CPU Usage", value: "23%", status: "normal", icon: <Cpu className="h-5 w-5" /> },
              { label: "Memory", value: "156MB", status: "normal", icon: <Database className="h-5 w-5" /> },
              { label: "Network", value: "2.3MB/s", status: "high", icon: <Activity className="h-5 w-5" /> }
            ].map((resource, index) => (
              <div 
                key={index}
                className={`flex items-center p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`p-2 rounded-lg mr-4 ${
                  resource.status === 'normal' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {resource.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {resource.label}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {resource.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-orange-600 to-red-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Optimize Your Workflows?
          </h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Take your automation to the next level with advanced optimization 
            techniques and performance monitoring.
          </p>
          <Button className="bg-white text-orange-700 hover:bg-orange-50">
            Start Optimizing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Optimize;