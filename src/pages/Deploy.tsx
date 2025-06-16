import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Rocket, 
  Server, 
  Globe, 
  Bell,
  ArrowRight,
  CheckCircle,
  Play,
  Monitor,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const Deploy: React.FC = () => {
  const { theme } = useTheme();

  const deploymentOptions = [
    {
      name: "Cloud Deployment",
      description: "Deploy to cloud platforms with automatic scaling",
      icon: <Globe className="h-6 w-6" />,
      status: "Recommended",
      features: ["Auto-scaling", "99.9% uptime", "Global CDN"],
      setupTime: "10 min"
    },
    {
      name: "Self-Hosted",
      description: "Deploy on your own infrastructure for full control",
      icon: <Server className="h-6 w-6" />,
      status: "Advanced",
      features: ["Full control", "Custom config", "Private network"],
      setupTime: "30 min"
    },
    {
      name: "Hybrid Setup",
      description: "Combine cloud and on-premise for optimal performance",
      icon: <Monitor className="h-6 w-6" />,
      status: "Enterprise",
      features: ["Best of both", "Load balancing", "Failover"],
      setupTime: "45 min"
    }
  ];

  const monitoringFeatures = [
    {
      title: "Real-time Alerts",
      description: "Get notified instantly when workflows fail or need attention",
      icon: <Bell className="h-5 w-5" />,
      color: "red"
    },
    {
      title: "Performance Monitoring",
      description: "Track execution times, success rates, and resource usage",
      icon: <Monitor className="h-5 w-5" />,
      color: "blue"
    },
    {
      title: "Auto-restart",
      description: "Automatically restart failed workflows with intelligent retry logic",
      icon: <Play className="h-5 w-5" />,
      color: "green"
    },
    {
      title: "Scheduled Execution",
      description: "Set up cron jobs and time-based triggers for your workflows",
      icon: <Clock className="h-5 w-5" />,
      color: "purple"
    }
  ];

  const deploymentSteps = [
    {
      step: 1,
      title: "Prepare Workflow",
      description: "Test and validate your workflow in development environment",
      status: "completed"
    },
    {
      step: 2,
      title: "Configure Environment",
      description: "Set up production environment variables and secrets",
      status: "completed"
    },
    {
      step: 3,
      title: "Deploy to Production",
      description: "Push your workflow to the production environment",
      status: "current"
    },
    {
      step: 4,
      title: "Monitor & Optimize",
      description: "Set up monitoring and optimize performance",
      status: "pending"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-green-200 mb-4">
            <Rocket className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">DEPLOY</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Launch Your Automations
          </h1>
          
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mb-8">
            Deploy your workflows to production with confidence. Set up monitoring, 
            alerts, and auto-restart capabilities for bulletproof automation.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-green-700 hover:bg-green-50">
              <Rocket className="mr-2 h-4 w-4" />
              Deploy Now
            </Button>
            
            <Button variant="outline" className="border-green-300 text-white hover:bg-white/10">
              Setup Monitoring
            </Button>
          </div>
        </div>
      </div>

      {/* Deployment Options */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Deployment Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deploymentOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    {option.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    option.status === 'Recommended' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                    option.status === 'Advanced' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                    'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
                  }`}>
                    {option.status}
                  </span>
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {option.name}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {option.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className={`text-sm ${
                        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Setup time: {option.setupTime}
                  </span>
                </div>
                
                <Button variant="outline" className="mt-auto">
                  Choose Option <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Deployment Progress */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-green-600/20 border-green-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900/20'
      }>
        <div className="space-y-6">
          <h3 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Deployment Progress
          </h3>
          
          <div className="space-y-4">
            {deploymentSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                  step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  step.status === 'current' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  theme === 'gradient' ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : step.status === 'current' ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    step.step
                  )}
                </div>
                <div>
                  <h4 className={`font-medium mb-1 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Monitoring Features */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Monitoring & Alerts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monitoringFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 mr-4`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Status */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Live Workflow Status
          </h3>
          <Button variant="outline" size="sm">
            <Monitor className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
        </div>
        
        <div className="space-y-4">
          {[
            { name: "Customer Onboarding Flow", status: "running", executions: "1,234", success: "99.2%" },
            { name: "Payment Processing", status: "running", executions: "856", success: "100%" },
            { name: "Email Notifications", status: "warning", executions: "2,341", success: "97.8%" },
            { name: "Data Sync Process", status: "stopped", executions: "0", success: "N/A" }
          ].map((workflow, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg ${
                theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${
                  workflow.status === 'running' ? 'bg-green-500' :
                  workflow.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {workflow.name}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {workflow.executions} executions • {workflow.success} success rate
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Go Live?
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Deploy your workflows with confidence using our robust deployment 
            and monitoring infrastructure.
          </p>
          <Button className="bg-white text-green-700 hover:bg-green-50">
            Start Deployment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Deploy;