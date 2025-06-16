import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Package, 
  Lightbulb, 
  Rocket, 
  Target, 
  ArrowRight, 
  Sparkles,
  Brain,
  Cpu,
  BarChart2
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const GenesisEngine: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "AI Ideation",
      description: "Generate innovative startup ideas based on market trends and opportunities",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "yellow"
    },
    {
      title: "Market Validation",
      description: "Automatically validate ideas against real market data and consumer trends",
      icon: <Target className="h-5 w-5" />,
      color: "blue"
    },
    {
      title: "MVP Blueprint",
      description: "Generate detailed blueprints for minimum viable products",
      icon: <Rocket className="h-5 w-5" />,
      color: "purple"
    }
  ];

  const startups = [
    {
      name: "EcoTrack AI",
      description: "AI-powered sustainability tracking platform for businesses",
      status: "Funded",
      raised: "$2.5M",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
    },
    {
      name: "HealthSync",
      description: "Personalized health recommendations using AI and wearable data",
      status: "Beta",
      raised: "$850K",
      image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg"
    },
    {
      name: "SmartRetail",
      description: "AI-driven inventory management and customer insights platform",
      status: "Launched",
      raised: "$1.2M",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-teal-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-green-200 mb-4">
            <Package className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">GENESIS ENGINE</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Turn Ideas into Startups with AI
          </h1>
          
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mb-8">
            Leverage our AI-powered platform to generate, validate, and launch innovative 
            startup ideas. From concept to MVP, Genesis Engine guides you every step of the way.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-green-700 hover:bg-green-50">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Startup Idea
            </Button>
            
            <Button variant="outline" className="border-green-300 text-white hover:bg-white/10">
              View Success Stories
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

      {/* AI Process Section */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-green-600/20 border-green-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900/20'
      }>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="flex items-center text-green-600 dark:text-green-400 mb-4">
              <Brain className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">AI-POWERED INNOVATION</span>
            </div>
            
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              How Genesis Engine Works
            </h3>
            
            <p className={`mb-6 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              Our advanced AI algorithms analyze market trends, consumer behavior, and 
              technological advancements to generate viable startup ideas with high 
              potential for success.
            </p>
            
            <div className="space-y-4">
              {[
                "Market opportunity analysis",
                "Competitive landscape mapping",
                "Revenue model generation",
                "Risk assessment and mitigation"
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`h-8 w-8 rounded-full text-green-600 dark:text-green-400 flex items-center justify-center mr-3 ${
                    theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-200'}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <div className={`rounded-lg p-4 shadow-sm ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
            }`}>
              <div className="flex items-center mb-2">
                <Cpu className="h-5 w-5 text-green-500 mr-2" />
                <span className={`font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  Idea Processing
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/30'
              }`}>
                <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-sm ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
            }`}>
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 text-blue-500 mr-2" />
                <span className={`font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  Market Analysis
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'gradient' ? 'bg-blue-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-sm ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
            }`}>
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
                <span className={`font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  Viability Score
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'gradient' ? 'bg-purple-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
              }`}>
                <div className="h-full w-4/5 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Stories */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Success Stories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {startups.map((startup, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={startup.image} 
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-5">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {startup.name}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {startup.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                    {startup.status}
                  </span>
                  <span className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    Raised: {startup.raised}
                  </span>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Case Study
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-green-600 to-teal-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your Startup?
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join hundreds of entrepreneurs who have successfully launched their startups 
            using Genesis Engine's AI-powered platform.
          </p>
          <Button className="bg-white text-green-700 hover:bg-green-50">
            Start Building <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GenesisEngine;