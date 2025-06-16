import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  BarChart2
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const SpeedWealth: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Weekly Money Missions",
      description: "Complete structured challenges designed to build profitable projects fast",
      icon: <Target className="h-5 w-5" />,
      color: "yellow"
    },
    {
      title: "Rapid MVP Development",
      description: "Turn ideas into profitable products in record time with AI assistance",
      icon: <Zap className="h-5 w-5" />,
      color: "purple"
    },
    {
      title: "Market Opportunity Scanner",
      description: "Identify lucrative opportunities with our AI market analysis tools",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "blue"
    }
  ];

  const successStories = [
    {
      name: "Sarah Chen",
      achievement: "Built 3 profitable MVPs in 30 days",
      revenue: "$12,500/month",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
    },
    {
      name: "Mark Thompson",
      achievement: "Automated income system built in 2 weeks",
      revenue: "$8,200/month",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      name: "Lisa Rodriguez",
      achievement: "Scaled to 6 figures in 90 days",
      revenue: "$25,000/month",
      image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-yellow-200 mb-4">
            <Zap className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">SPEED WEALTH SYSTEMS</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build Wealth Faster with AI
          </h1>
          
          <p className="text-yellow-100 text-lg md:text-xl max-w-2xl mb-8">
            Complete weekly money missions, build fast MVPs, and discover profitable 
            opportunities using our AI-powered wealth building system.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-yellow-700 hover:bg-yellow-50">
              <Zap className="mr-2 h-4 w-4" />
              Start Your First Mission
            </Button>
            
            <Button variant="outline" className="border-yellow-300 text-white hover:bg-white/10">
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

      {/* Current Missions */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-yellow-600/20 border-yellow-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-yellow-50 dark:from-gray-900 dark:to-yellow-900/20'
      }>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Active Money Missions
            </h3>
            <Button variant="outline" size="sm">
              View All Missions
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "AI Tool Launch Challenge",
                reward: "$5,000",
                timeLeft: "5 days",
                participants: 234
              },
              {
                title: "30-Day MVP Sprint",
                reward: "$10,000",
                timeLeft: "12 days",
                participants: 156
              },
              {
                title: "Passive Income System Setup",
                reward: "$3,000",
                timeLeft: "3 days",
                participants: 312
              }
            ].map((mission, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-lg text-yellow-600 dark:text-yellow-400 flex items-center justify-center mr-4 ${
                    theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {mission.title}
                    </h4>
                    <div className={`flex items-center text-sm mt-1 ${
                      theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <Clock className="h-4 w-4 mr-1" />
                      {mission.timeLeft} left
                      <span className="mx-2">•</span>
                      <Users className="h-4 w-4 mr-1" />
                      {mission.participants} participants
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <span className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>Reward</span>
                    <div className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {mission.reward}
                    </div>
                  </div>
                  <Button size="sm">Join Mission</Button>
                </div>
              </div>
            ))}
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
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {story.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
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
                    Current Revenue
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {story.revenue}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Wealth Generated",
            value: "$12.5M+",
            icon: <DollarSign className="h-5 w-5" />,
            color: "green"
          },
          {
            label: "Active Participants",
            value: "2,450+",
            icon: <Users className="h-5 w-5" />,
            color: "blue"
          },
          {
            label: "Avg. Time to Profit",
            value: "14 Days",
            icon: <Clock className="h-5 w-5" />,
            color: "purple"
          },
          {
            label: "Success Rate",
            value: "89%",
            icon: <BarChart2 className="h-5 w-5" />,
            color: "yellow"
          }
        ].map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {stat.label}
                </p>
                <p className={`text-xl font-bold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Accelerate Your Wealth Building?
          </h3>
          <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who are using Speed Wealth Systems to build 
            profitable businesses faster than ever before.
          </p>
          <Button className="bg-white text-yellow-700 hover:bg-yellow-50">
            Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SpeedWealth;