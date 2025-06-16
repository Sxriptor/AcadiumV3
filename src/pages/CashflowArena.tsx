import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ArrowRight,
  BarChart2,
  Briefcase,
  Target,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const CashflowArena: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Affiliate Program Builder",
      description: "Create and manage high-converting affiliate programs with automated tracking",
      icon: <Users className="h-5 w-5" />,
      color: "green"
    },
    {
      title: "Sales Funnel Templates",
      description: "Ready-to-use funnel templates optimized for maximum conversion",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "blue"
    },
    {
      title: "Commission Optimization",
      description: "AI-driven tools to optimize your commission structures and payouts",
      icon: <DollarSign className="h-5 w-5" />,
      color: "purple"
    }
  ];

  const metrics = [
    {
      label: "Total Revenue",
      value: "$1.2M",
      change: "+15%",
      isPositive: true
    },
    {
      label: "Active Affiliates",
      value: "1,234",
      change: "+8%",
      isPositive: true
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      change: "+2.5%",
      isPositive: true
    },
    {
      label: "Avg. Commission",
      value: "$450",
      change: "+12%",
      isPositive: true
    }
  ];

  const strategies = [
    {
      title: "High-Ticket Mastery",
      description: "Learn to sell premium products and services with confidence",
      earnings: "$5,000 - $20,000/mo",
      difficulty: "Advanced",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
    },
    {
      title: "DM Funnel System",
      description: "Convert social media followers into high-paying clients",
      earnings: "$3,000 - $10,000/mo",
      difficulty: "Intermediate",
      image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg"
    },
    {
      title: "Affiliate Stacking",
      description: "Build multiple streams of affiliate income simultaneously",
      earnings: "$2,000 - $8,000/mo",
      difficulty: "Beginner",
      image: "https://images.pexels.com/photos/3182744/pexels-photo-3182744.jpeg"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-green-200 mb-4">
            <DollarSign className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">CASHFLOW ARENA</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Master the Art of Income Generation
          </h1>
          
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mb-8">
            Learn proven strategies for building multiple income streams through affiliate 
            marketing, high-ticket sales, and automated funnels.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-green-700 hover:bg-green-50">
              <Zap className="mr-2 h-4 w-4" />
              Start Earning
            </Button>
            
            <Button variant="outline" className="border-green-300 text-white hover:bg-white/10">
              View Strategies
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Income Strategies */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Proven Income Strategies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((strategy, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={strategy.image} 
                  alt={strategy.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-5">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {strategy.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {strategy.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                    {strategy.earnings}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                    {strategy.difficulty}
                  </span>
                </div>
                
                <Button variant="outline" className="w-full">
                  Start Learning
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Path */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-green-600/20 border-green-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900/20'
      }>
        <div className="space-y-6">
          <h3 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Your Path to Success
          </h3>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Foundation Setup",
                description: "Set up your affiliate accounts and tracking systems"
              },
              {
                step: 2,
                title: "Strategy Selection",
                description: "Choose your primary income generation method"
              },
              {
                step: 3,
                title: "Implementation",
                description: "Deploy your chosen strategies with our proven systems"
              },
              {
                step: 4,
                title: "Optimization",
                description: "Fine-tune your approach for maximum results"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-green-600 dark:text-green-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/30'
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
      <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your Income?
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs who have mastered the art of 
            generating consistent income through our proven strategies.
          </p>
          <Button className="bg-white text-green-700 hover:bg-green-50">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CashflowArena;