import React from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bot, 
  Plug, 
  Rocket, 
  Settings, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvancedN8nIndex: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "AI Agents",
      description: "Build intelligent automation agents with n8n",
      icon: <Bot className="h-6 w-6" />,
      to: "/n8n-ai-agents",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Integrations",
      description: "Connect with external services and APIs",
      icon: <Plug className="h-6 w-6" />,
      to: "/n8n/integrate",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Deployment",
      description: "Deploy your automation workflows",
      icon: <Rocket className="h-6 w-6" />,
      to: "/n8n/deploy",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Optimization",
      description: "Fine-tune your workflow performance",
      icon: <Settings className="h-6 w-6" />,
      to: "/n8n/optimize",
      color: "from-orange-500 to-red-600"
    }
  ];

  const resources = [
    {
      title: "n8n Documentation",
      description: "Official documentation and guides",
      url: "https://docs.n8n.io/",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
    },
    {
      title: "n8n Community Forum",
      description: "Get help and share knowledge",
      url: "https://community.n8n.io/",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
    },
    {
      title: "n8n GitHub Repository",
      description: "Explore the source code and contribute",
      url: "https://github.com/n8n-io/n8n",
      color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-purple-200 mb-4">
            <Bot className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">ADVANCED N8N</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build Powerful Automation Workflows
          </h1>
          
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mb-8">
            Create, deploy, and manage intelligent automation workflows with n8n's 
            visual builder and extensive integration library.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-purple-700 hover:bg-purple-50">
              <Bot className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            
            <Button variant="outline" className="border-purple-300 text-white hover:bg-white/10">
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Key Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.to} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg group-hover:translate-y-[-4px]">
                <div className="flex flex-col h-full">
                  <div className={`p-3 mb-4 rounded-lg bg-gradient-to-br ${feature.color} w-12 h-12 flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm flex-grow ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mt-4">
                    <span>Explore</span>
                    <ArrowRight size={16} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          External Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {resource.title}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {resource.description}
                </p>
                
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${resource.color}`}
                >
                  Visit Resource
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-purple-600/20 border-purple-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20'
      }>
        <div className="space-y-6">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Getting Started with n8n
          </h2>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Create Your First Workflow",
                description: "Build a simple automation workflow to understand the basics"
              },
              {
                step: 2,
                title: "Connect External Services",
                description: "Integrate with APIs, databases, and third-party platforms"
              },
              {
                step: 3,
                title: "Add Logic and Conditions",
                description: "Implement decision-making in your workflows"
              },
              {
                step: 4,
                title: "Deploy and Monitor",
                description: "Launch your workflow and track its performance"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-purple-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
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
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Automate Your Workflows?
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Start building powerful automation workflows with n8n's visual builder 
            and extensive integration library.
          </p>
          <Link to="/n8n-ai-agents">
            <Button className="bg-white text-purple-700 hover:bg-purple-50">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedN8nIndex;