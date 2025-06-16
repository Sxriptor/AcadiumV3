import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plug, 
  Database, 
  Cloud, 
  Webhook,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const Integrate: React.FC = () => {
  const { theme } = useTheme();

  const integrations = [
    {
      name: "Supabase",
      description: "Database operations and real-time subscriptions",
      icon: <Database className="h-6 w-6" />,
      status: "Available",
      category: "Database",
      difficulty: "Beginner",
      setupTime: "5 min"
    },
    {
      name: "Discord",
      description: "Bot interactions and webhook notifications",
      icon: <Webhook className="h-6 w-6" />,
      status: "Available", 
      category: "Communication",
      difficulty: "Intermediate",
      setupTime: "10 min"
    },
    {
      name: "Stripe",
      description: "Payment processing and subscription management",
      icon: <Cloud className="h-6 w-6" />,
      status: "Available",
      category: "Payments",
      difficulty: "Advanced",
      setupTime: "15 min"
    },
    {
      name: "OpenAI",
      description: "AI model integration for intelligent workflows",
      icon: <Settings className="h-6 w-6" />,
      status: "Available",
      category: "AI",
      difficulty: "Intermediate", 
      setupTime: "8 min"
    }
  ];

  const tutorials = [
    {
      title: "Setting up Webhook Endpoints",
      description: "Learn how to create and configure webhook endpoints for external services",
      duration: "12 min",
      difficulty: "Beginner"
    },
    {
      title: "Database Integration Patterns",
      description: "Best practices for connecting databases to your automation workflows",
      duration: "18 min",
      difficulty: "Intermediate"
    },
    {
      title: "API Authentication Methods",
      description: "Secure your integrations with proper authentication techniques",
      duration: "15 min",
      difficulty: "Advanced"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-blue-200 mb-4">
            <Plug className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">INTEGRATE</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Connect Everything Together
          </h1>
          
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-8">
            Seamlessly integrate third-party applications and services into your 
            automation workflows with our comprehensive integration library.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-blue-700 hover:bg-blue-50">
              <Plug className="mr-2 h-4 w-4" />
              Browse Integrations
            </Button>
            
            <Button variant="outline" className="border-blue-300 text-white hover:bg-white/10">
              View Tutorials
            </Button>
          </div>
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Available Integrations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {integration.name}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {integration.description}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  {integration.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  theme === 'gradient' 
                    ? 'bg-gray-700 text-gray-200' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}>
                  {integration.category}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  integration.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                  integration.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                }`}>
                  {integration.difficulty}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  theme === 'gradient' 
                    ? 'bg-gray-700 text-gray-200' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}>
                  {integration.setupTime}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1">
                  Setup Integration
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Tutorials */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Integration Tutorials
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {tutorial.title}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {tutorial.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {tutorial.duration}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    tutorial.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                    tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                
                <Button variant="outline" className="mt-auto">
                  Start Tutorial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Setup Guide */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-blue-600/20 border-blue-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20'
      }>
        <div className="space-y-6">
          <h3 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Quick Setup Guide
          </h3>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Choose Integration",
                description: "Select the service you want to connect"
              },
              {
                step: 2,
                title: "Configure Credentials",
                description: "Add API keys and authentication details"
              },
              {
                step: 3,
                title: "Test Connection",
                description: "Verify the integration is working properly"
              },
              {
                step: 4,
                title: "Build Workflow",
                description: "Create automation workflows using the integration"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-blue-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {step.step}
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

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Connect Your Tools?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Start building powerful integrations and automate your workflows 
            with our comprehensive integration platform.
          </p>
          <Button className="bg-white text-blue-700 hover:bg-blue-50">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Integrate;