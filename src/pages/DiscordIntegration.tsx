import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  MessageSquare, 
  Users, 
  Bell, 
  Settings,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const DiscordIntegration: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Real-time Chat",
      description: "Seamless communication with team members and collaborators",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "indigo"
    },
    {
      title: "Community Management",
      description: "Powerful tools to manage and grow your Discord community",
      icon: <Users className="h-5 w-5" />,
      color: "purple"
    },
    {
      title: "Smart Notifications",
      description: "AI-powered notification system for important updates",
      icon: <Bell className="h-5 w-5" />,
      color: "blue"
    }
  ];

  const integrationSteps = [
    {
      step: 1,
      title: "Create Discord Server",
      description: "Set up your Discord server with the recommended structure"
    },
    {
      step: 2,
      title: "Configure Bot",
      description: "Add and configure the integration bot to your server"
    },
    {
      step: 3,
      title: "Set Permissions",
      description: "Configure roles and permissions for your community"
    },
    {
      step: 4,
      title: "Start Engaging",
      description: "Begin interacting with your community through Discord"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-indigo-200 mb-4">
            <MessageSquare className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">DISCORD INTEGRATION</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Connect Your Community
          </h1>
          
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mb-8">
            Integrate Discord with our platform for seamless community management and 
            real-time collaboration.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
              <MessageSquare className="mr-2 h-4 w-4" />
              Connect Discord
            </Button>
            
            <Button variant="outline" className="border-indigo-300 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
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

      {/* Integration Steps */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-indigo-600/20 border-indigo-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20'
      }>
        <div className="space-y-6">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Getting Started
          </h2>
          
          <div className="space-y-4">
            {integrationSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-indigo-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
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

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Community Features
          </h3>
          <div className="space-y-4">
            {[
              "Real-time chat and collaboration",
              "Voice channels for live discussions",
              "Role-based access control",
              "Custom bot integration",
              "Event scheduling and management",
              "File sharing and organization"
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}>{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Security & Privacy
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "End-to-End Encryption",
                description: "Secure communication channels for sensitive discussions",
                icon: <Shield className="h-5 w-5" />
              },
              {
                title: "Role Management",
                description: "Granular control over user permissions and access",
                icon: <Users className="h-5 w-5" />
              },
              {
                title: "Activity Monitoring",
                description: "Track and manage community engagement",
                icon: <Bell className="h-5 w-5" />
              },
              {
                title: "Custom Settings",
                description: "Tailor the integration to your specific needs",
                icon: <Settings className="h-5 w-5" />
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3 ${
                  theme === 'gradient' ? 'bg-indigo-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Setup */}
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-2/3">
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Quick Setup Available
            </h3>
            <p className={`mb-6 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              Get your Discord community up and running in minutes with our automated setup process. 
              We'll help you configure everything from channels to permissions.
            </p>
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Start Quick Setup
            </Button>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className={`aspect-square rounded-lg flex items-center justify-center ${
              theme === 'gradient' ? 'bg-indigo-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
            }`}>
              <MessageSquare className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Connect Your Community?
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of communities already using our Discord integration to engage and grow their audience.
          </p>
          <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
            Connect Discord Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DiscordIntegration;