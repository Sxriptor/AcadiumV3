import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Layers, 
  Shirt, 
  Code, 
  FileText, 
  Ghost,
  Zap,
  Users,
  ArrowRight,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Target,
  CheckCircle,
  BarChart2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvancedIndex: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const niches = [
    {
      id: 'clothing',
      title: "Clothing Brand",
      description: "Build and scale an automated clothing brand with AI marketing",
      icon: <Shirt className="h-6 w-6" />,
      to: "/advanced/clothing-brand",
      color: "from-pink-500 to-rose-600",
      earnings: "$10,000 - $50,000/month",
      timeToProfit: "2-3 months",
      difficulty: "Intermediate"
    },
    {
      id: 'webdev',
      title: "Web/Mobile Dev",
      description: "Create a high-ticket development agency with AI acceleration",
      icon: <Code className="h-6 w-6" />,
      to: "/advanced/webdev",
      color: "from-blue-500 to-indigo-600",
      earnings: "$15,000 - $50,000/month",
      timeToProfit: "1-2 months",
      difficulty: "Intermediate"
    },
    {
      id: 'copywriting',
      title: "AI Copywriting",
      description: "Build a premium AI copywriting business with automated systems",
      icon: <FileText className="h-6 w-6" />,
      to: "/advanced/copywriting",
      color: "from-amber-500 to-yellow-600",
      earnings: "$8,000 - $30,000/month",
      timeToProfit: "2-4 weeks",
      difficulty: "Beginner-Friendly"
    },
    {
      id: 'influencer',
      title: "AI Influencer",
      description: "Create and monetize AI personalities across multiple platforms",
      icon: <Ghost className="h-6 w-6" />,
      to: "/advanced/ai-influencer",
      color: "from-purple-500 to-violet-600",
      earnings: "$5,000 - $100,000/month",
      timeToProfit: "1-3 months",
      difficulty: "Intermediate"
    },
    {
      id: 'automation',
      title: "Automation Agency",
      description: "Offer premium automation services to high-paying businesses",
      icon: <Zap className="h-6 w-6" />,
      to: "/advanced/automation-agency",
      color: "from-green-500 to-emerald-600",
      earnings: "$20,000 - $100,000/month",
      timeToProfit: "2-3 months",
      difficulty: "Advanced"
    },
    {
      id: 'network',
      title: "Elite Network",
      description: "Connect with advanced practitioners and form strategic partnerships",
      icon: <Users className="h-6 w-6" />,
      to: "/advanced/elite-network",
      color: "from-gray-700 to-gray-900",
      earnings: "Network Value",
      timeToProfit: "Immediate",
      difficulty: "All Levels"
    }
  ];

  const successMetrics = [
    {
      label: "Average Monthly Income",
      value: "$32,500",
      change: "+45%",
      isPositive: true
    },
    {
      label: "Active Members",
      value: "2,450+",
      change: "+18%",
      isPositive: true
    },
    {
      label: "Success Rate",
      value: "78%",
      change: "+12%",
      isPositive: true
    },
    {
      label: "Avg. Time to Profit",
      value: "47 days",
      change: "-15%",
      isPositive: true
    }
  ];

  const successStories = [
    {
      name: "Sarah Chen",
      niche: "AI Influencer",
      achievement: "Built 5 AI personalities generating $43,000/month",
      timeframe: "4 months",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
    },
    {
      name: "Michael Rodriguez",
      niche: "Automation Agency",
      achievement: "Scaled to $87,000/month with 12 B2B clients",
      timeframe: "6 months",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      name: "Emily Johnson",
      niche: "AI Copywriting",
      achievement: "Built a $25,000/month business with 3 premium clients",
      timeframe: "3 months",
      image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg"
    }
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-gray-300 mb-4">
            <Layers className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">ADVANCED BUSINESS SYSTEMS</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build Profitable AI Businesses
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
            Complete systems to build and scale profitable businesses in high-value niches.
            From setup to scaling, with proven monetization strategies.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-gray-900 hover:bg-gray-100">
              <DollarSign className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-white hover:bg-white/10">
              View Success Stories
            </Button>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {successMetrics.map((metric, index) => (
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

      {/* Niche Selection */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Select Your Niche
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niches.map((niche, index) => (
            <Link key={index} to={niche.to} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg group-hover:translate-y-[-4px]">
                <div className="flex flex-col h-full">
                  <div className={`p-3 mb-4 rounded-lg bg-gradient-to-br ${niche.color} w-12 h-12 flex items-center justify-center text-white`}>
                    {niche.icon}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {niche.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {niche.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
                        Potential Earnings
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {niche.earnings}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
                        Time to Profit
                      </span>
                      <span className="font-medium">
                        {niche.timeToProfit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
                        Difficulty
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        niche.difficulty === 'Beginner-Friendly' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                          : niche.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : niche.difficulty === 'Advanced'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      }`}>
                        {niche.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mt-4">
                    <span>Start Building</span>
                    <ArrowRight size={16} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Success Stories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {story.name}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                    {story.niche}
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {story.achievement}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Timeframe
                  </span>
                  <span className="font-medium">
                    {story.timeframe}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Advanced Systems */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
      }>
        <div className="space-y-6">
          <h3 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Why Our Advanced Systems Work
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Complete End-to-End Systems",
                description: "Not just tactics, but complete business systems from setup to scale",
                icon: <Layers className="h-5 w-5" />,
                color: "blue"
              },
              {
                title: "Monetization-First Approach",
                description: "Every system is designed with clear revenue generation as the priority",
                icon: <DollarSign className="h-5 w-5" />,
                color: "green"
              },
              {
                title: "Proven by Real Results",
                description: "Systems tested and proven by our community of successful entrepreneurs",
                icon: <BarChart2 className="h-5 w-5" />,
                color: "purple"
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-3 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 mr-4 flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className={`font-medium mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {feature.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your AI Business Empire?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Choose your niche and start implementing our proven systems to build a profitable AI-powered business.
          </p>
          <Button className="bg-white text-gray-900 hover:bg-gray-100">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedIndex;