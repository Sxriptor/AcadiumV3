import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Search, 
  BarChart2, 
  Radio, 
  Wifi, 
  Shield, 
  Eye, 
  Terminal,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const SignalIntelligence: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Pattern Recognition",
      description: "Advanced algorithms to detect and analyze signal patterns in real-time",
      icon: <Radio className="h-5 w-5" />,
      color: "blue"
    },
    {
      title: "Network Analysis",
      description: "Comprehensive network traffic analysis and monitoring tools",
      icon: <Wifi className="h-5 w-5" />,
      color: "purple"
    },
    {
      title: "Security Protocols",
      description: "Implementation of robust security measures and encryption",
      icon: <Shield className="h-5 w-5" />,
      color: "green"
    }
  ];

  const metrics = [
    {
      label: "Active Signals",
      value: "1,234",
      change: "+12%",
      isPositive: true
    },
    {
      label: "Threats Detected",
      value: "23",
      change: "-8%",
      isPositive: true
    },
    {
      label: "Network Load",
      value: "76%",
      change: "+5%",
      isPositive: false
    }
  ];

  const alerts = [
    {
      type: "warning",
      message: "Unusual network activity detected in sector 7",
      time: "2 minutes ago"
    },
    {
      type: "success",
      message: "Security protocols updated successfully",
      time: "15 minutes ago"
    },
    {
      type: "warning",
      message: "High bandwidth usage in development servers",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative z-10">
          <div className="flex items-center text-gray-300 mb-4">
            <Search className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">SIGNAL INTELLIGENCE</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Advanced Signal Analysis Platform
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
            Monitor, analyze, and secure your digital infrastructure with our comprehensive 
            signal intelligence tools and real-time analytics.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Eye className="mr-2 h-4 w-4" />
              Live Monitor
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Terminal className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col h-full">
              <div className={`p-3 mb-4 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 w-12 h-12 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400`}>
                {feature.icon}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {feature.title}
              </h3>
              
              <p className={`text-sm mb-4 flex-grow ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {feature.description}
              </p>
              
              <Button variant="outline" className="mt-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Live Alerts */}
      <Card className="bg-gray-900 text-white">
        <h3 className="text-lg font-semibold mb-4">Live Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className="flex items-start p-3 rounded-lg bg-gray-800"
            >
              {alert.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              )}
              
              <div className="flex-grow">
                <p className="text-sm">{alert.message}</p>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Graph */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Network Activity
          </h3>
          <Button variant="outline" size="sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            View Full Report
          </Button>
        </div>
        
        <div className={`h-64 rounded-lg flex items-center justify-center ${
          theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <p className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
            Activity graph visualization would go here
          </p>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Enhance Your Security?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get started with our advanced signal intelligence tools and protect your digital assets.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Monitoring <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SignalIntelligence;